import {
    FETCH_ARTICLES_REQUEST,
    FETCH_ARTICLES_SUCCESS,
    FETCH_ARTICLES_FAILURE,
    SEARCH_ARTICLES,
    SAVE_ARTICLE,
    SAVE_ARTICLE_FAILURE,
    UNSAVE_ARTICLE,
    UNSAVE_ARTICLE_FAILURE,
    SET_SELECTED_ARTICLE,
    FETCH_SAVED_ARTICLES,
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

export const articleReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ARTICLES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_ARTICLES_SUCCESS:
            const newArticles = action.payload.articles.filter(
                newArticle => !state.articles.some(existingArticle => existingArticle._id === newArticle._id)
            );
            return {
                ...state,
                loading: false,
                articles: action.payload.currentPage === 1
                    ? newArticles
                    : [...state.articles, ...newArticles],
                hasMore: action.payload.hasMore,
                page: action.payload.currentPage + 1,
                totalPages: action.payload.totalPages,
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
                articles: action.payload.articles,
                hasMore: action.payload.currentPage < action.payload.totalPages,
                page: action.payload.currentPage + 1,
                totalPages: action.payload.totalPages,
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
        case SAVE_ARTICLE_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case UNSAVE_ARTICLE:
            return {
                ...state,
                savedArticles: state.savedArticles.filter(article => article._id !== action.payload),
                articles: state.articles.map(article =>
                    article._id === action.payload ? { ...article, isSaved: false } : article
                )
            };
        case UNSAVE_ARTICLE_FAILURE:
            return {
                ...state,
                error: action.payload
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
};