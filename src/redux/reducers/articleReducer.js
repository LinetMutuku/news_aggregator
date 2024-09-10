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
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
    totalPages: 0,
    selectedArticle: null
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
                articles: [...state.articles, ...action.payload],
                hasMore: state.page < action.totalPages,
                page: state.page + 1,
                totalPages: action.totalPages
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
                hasMore: false
            };
        case SAVE_ARTICLE:
            return {
                ...state,
                articles: state.articles.map(article =>
                    article._id === action.payload ? { ...article, isSaved: true } : article
                )
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
                savedArticles: action.payload
            };
        case UNSAVE_ARTICLE:
            return {
                ...state,
                savedArticles: state.savedArticles.filter(article => article.articleId !== action.payload)
            };
        case SEARCH_SAVED_ARTICLES:
            return {
                ...state,
                loading: false,
                savedArticles: action.payload
            };
        default:
            return state;
    }
}