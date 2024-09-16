import {
    FETCH_ARTICLES_REQUEST,
    FETCH_ARTICLES_SUCCESS,
    FETCH_ARTICLES_FAILURE,
    SEARCH_ARTICLES,
    SAVE_ARTICLE,
    SET_SELECTED_ARTICLE,
    FETCH_SAVED_ARTICLES,
    UNSAVE_ARTICLE,
    SEARCH_SAVED_ARTICLES
} from '../actions/articleActions';

const initialState = {
    articles: [],
    savedArticles: [],
    selectedArticle: null,
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    totalPages: 0
};

export default function articleReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_ARTICLES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_ARTICLES_SUCCESS:
            return {
                ...state,
                loading: false,
                articles: action.currentPage === 1 ? action.payload : [...state.articles, ...action.payload],
                hasMore: action.currentPage < action.totalPages,
                page: action.currentPage + 1,
                totalPages: action.totalPages,
                error: null
            };
        case FETCH_ARTICLES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SEARCH_ARTICLES:
            return {
                ...state,
                loading: false,
                articles: action.payload,
                hasMore: action.currentPage < action.totalPages,
                page: action.currentPage + 1,
                totalPages: action.totalPages,
                error: null
            };
        case SAVE_ARTICLE:
            return {
                ...state,
                articles: state.articles.map(article =>
                    article._id === action.payload._id ? { ...article, isSaved: true } : article
                ),
                savedArticles: [...state.savedArticles, action.payload]
            };
        case SET_SELECTED_ARTICLE:
            return {
                ...state,
                selectedArticle: action.payload
            };
        case FETCH_SAVED_ARTICLES:
            return {
                ...state,
                loading: false,
                savedArticles: action.payload,
                error: null
            };
        case UNSAVE_ARTICLE:
            return {
                ...state,
                savedArticles: state.savedArticles.filter(article => article._id !== action.payload),
                articles: state.articles.map(article =>
                    article._id === action.payload ? { ...article, isSaved: false } : article
                )
            };
        case SEARCH_SAVED_ARTICLES:
            return {
                ...state,
                loading: false,
                savedArticles: action.payload,
                error: null
            };
        default:
            return state;
    }
}