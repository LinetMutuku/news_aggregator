import {
    FETCH_ARTICLES_REQUEST,
    FETCH_ARTICLES_SUCCESS,
    FETCH_ARTICLES_FAILURE,
    SEARCH_ARTICLES,
    SAVE_ARTICLE,
    UNSAVE_ARTICLE,
    UNSAVE_ARTICLE_FAILURE,
    DELETE_ARTICLE,
    DELETE_ARTICLE_FAILURE,
    SET_SELECTED_ARTICLE,
    FETCH_SAVED_ARTICLES,
    SEARCH_SAVED_ARTICLES
} from '../actions/articleActions';

const initialState = {
    articles: [],
    savedArticles: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    selectedArticle: null
};

const articleReducer = (state = initialState, action) => {
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
                articles: action.payload.articles || [],
                currentPage: action.payload.currentPage,
                totalPages: action.payload.totalPages,
                loading: false,
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
                articles: action.payload.articles || [],
                currentPage: action.payload.currentPage,
                totalPages: action.payload.totalPages,
                error: null
            };

        case SAVE_ARTICLE: {
            const isAlreadySaved = state.savedArticles.some(
                article => article._id === action.payload._id
            );

            return {
                ...state,
                articles: state.articles.map(article =>
                    article._id === action.payload._id
                        ? { ...article, isSaved: true }
                        : article
                ),
                savedArticles: isAlreadySaved
                    ? state.savedArticles
                    : [...state.savedArticles, action.payload]
            };
        }

        case FETCH_SAVED_ARTICLES:
            return {
                ...state,
                savedArticles: action.payload,
                loading: false,
                error: null
            };

        case UNSAVE_ARTICLE:
            return {
                ...state,
                savedArticles: state.savedArticles.filter(
                    article => article._id !== action.payload
                ),
                articles: state.articles.map(article =>
                    article._id === action.payload
                        ? { ...article, isSaved: false }
                        : article
                )
            };

        case UNSAVE_ARTICLE_FAILURE:
            return {
                ...state,
                error: action.payload
            };

        case DELETE_ARTICLE:
            return {
                ...state,
                articles: state.articles.filter(
                    article => article._id !== action.payload
                ),
                savedArticles: state.savedArticles.filter(
                    article => article._id !== action.payload
                ),
                loading: false,
                error: null
            };

        case DELETE_ARTICLE_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false
            };

        case SET_SELECTED_ARTICLE:
            return {
                ...state,
                selectedArticle: action.payload
            };

        case SEARCH_SAVED_ARTICLES:
            return {
                ...state,
                loading: false,
                savedArticles: action.payload || [],
                error: null
            };

        default:
            return state;
    }
};

export default articleReducer;