import * as api from '../../utils/api';

export const FETCH_ARTICLES_REQUEST = 'FETCH_ARTICLES_REQUEST';
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS';
export const FETCH_ARTICLES_FAILURE = 'FETCH_ARTICLES_FAILURE';
export const SEARCH_ARTICLES = 'SEARCH_ARTICLES';
export const SAVE_ARTICLE = 'SAVE_ARTICLE';
export const SAVE_ARTICLE_FAILURE = 'SAVE_ARTICLE_FAILURE';
export const SET_SELECTED_ARTICLE = 'SET_SELECTED_ARTICLE';
export const FETCH_SAVED_ARTICLES = 'FETCH_SAVED_ARTICLES';
export const UNSAVE_ARTICLE = 'UNSAVE_ARTICLE';
export const SEARCH_SAVED_ARTICLES = 'SEARCH_SAVED_ARTICLES';

export const fetchArticles = (page = 1, limit = 20) => async (dispatch) => {
    console.log('fetchArticles action called with page:', page, 'limit:', limit);
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const response = await api.getRecommendedArticles(page, limit);
        console.log('API response received:', response);
        if (!Array.isArray(response.recommendations)) {
            throw new Error('Received invalid data structure from API');
        }
        dispatch({
            type: FETCH_ARTICLES_SUCCESS,
            payload: response.recommendations,
            totalPages: response.totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error('Error in fetchArticles:', error);
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message || 'Failed to fetch articles'
        });
        throw error;
    }
};

export const searchArticlesAction = (query, page = 1, limit = 20) => async (dispatch) => {
    console.log('searchArticlesAction called with query:', query, 'page:', page, 'limit:', limit);
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const response = await api.searchArticles(query, page, limit);
        console.log('Search API response received:', response);
        if (!Array.isArray(response.articles)) {
            throw new Error('Received invalid data structure from search API');
        }
        dispatch({
            type: SEARCH_ARTICLES,
            payload: response.articles,
            totalPages: response.totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error('Error in searchArticlesAction:', error);
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message || 'Failed to search articles'
        });
        throw error;
    }
};

export const saveArticleAction = (article) => async (dispatch) => {
    console.log('saveArticleAction called with article:', article);
    try {
        if (!article || !article._id || !article.title) {
            throw new Error('Invalid article object: Missing _id or title');
        }
        const savedArticle = await api.saveArticle(article);
        console.log('Article saved successfully:', savedArticle);
        dispatch({
            type: SAVE_ARTICLE,
            payload: savedArticle
        });
        return savedArticle;
    } catch (error) {
        console.error('Error in saveArticleAction:', error);
        console.error('Error details:', error.response?.data);
        dispatch({
            type: SAVE_ARTICLE_FAILURE,
            payload: error.response?.data?.message || error.message || 'Failed to save article'
        });
        throw error;
    }
};

export const setSelectedArticle = (articleId) => async (dispatch) => {
    console.log('setSelectedArticle called with id:', articleId);
    try {
        if (!articleId) {
            console.warn('Attempted to set selected article with null/undefined id');
            dispatch({
                type: SET_SELECTED_ARTICLE,
                payload: null
            });
            return;
        }
        const article = await api.getArticleById(articleId);
        console.log('Selected article details:', article);
        dispatch({
            type: SET_SELECTED_ARTICLE,
            payload: article
        });
    } catch (error) {
        console.error('Error in setSelectedArticle:', error);
        dispatch({
            type: SET_SELECTED_ARTICLE,
            payload: null
        });
    }
};

export const fetchSavedArticles = () => async (dispatch) => {
    console.log('fetchSavedArticles called');
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const savedArticles = await api.getSavedArticles();
        console.log('Saved articles received:', savedArticles);
        if (!Array.isArray(savedArticles)) {
            throw new Error('Received invalid data structure for saved articles');
        }
        dispatch({
            type: FETCH_SAVED_ARTICLES,
            payload: savedArticles
        });
    } catch (error) {
        console.error('Error in fetchSavedArticles:', error);
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message || 'Failed to fetch saved articles'
        });
        throw error;
    }
};

export const unsaveArticleAction = (articleId) => async (dispatch) => {
    console.log('unsaveArticleAction called with id:', articleId);
    try {
        await api.unsaveArticle(articleId);
        console.log('Article unsaved successfully');
        dispatch({
            type: UNSAVE_ARTICLE,
            payload: articleId
        });
    } catch (error) {
        console.error('Error in unsaveArticleAction:', error);
        throw error;
    }
};

export const searchSavedArticlesAction = (query) => async (dispatch) => {
    console.log('searchSavedArticlesAction called with query:', query);
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const response = await api.searchSavedArticles(query);
        console.log('Saved articles search response:', response);
        if (!Array.isArray(response)) {
            throw new Error('Received invalid data structure from saved articles search API');
        }
        dispatch({
            type: SEARCH_SAVED_ARTICLES,
            payload: response
        });
    } catch (error) {
        console.error('Error in searchSavedArticlesAction:', error);
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message || 'Failed to search saved articles'
        });
        throw error;
    }
};