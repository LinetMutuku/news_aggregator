import * as api from '../../utils/api';

// Action Types
export const FETCH_ARTICLES_REQUEST = 'FETCH_ARTICLES_REQUEST';
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS';
export const FETCH_ARTICLES_FAILURE = 'FETCH_ARTICLES_FAILURE';
export const SEARCH_ARTICLES = 'SEARCH_ARTICLES';
export const SAVE_ARTICLE = 'SAVE_ARTICLE';
export const SAVE_ARTICLE_FAILURE = 'SAVE_ARTICLE_FAILURE';
export const UNSAVE_ARTICLE = 'UNSAVE_ARTICLE';
export const UNSAVE_ARTICLE_FAILURE = 'UNSAVE_ARTICLE_FAILURE';
export const DELETE_ARTICLE = 'DELETE_ARTICLE';
export const DELETE_ARTICLE_FAILURE = 'DELETE_ARTICLE_FAILURE';
export const SET_SELECTED_ARTICLE = 'SET_SELECTED_ARTICLE';
export const FETCH_SAVED_ARTICLES = 'FETCH_SAVED_ARTICLES';
export const SEARCH_SAVED_ARTICLES = 'SEARCH_SAVED_ARTICLES';

// Action Creators
export const fetchArticles = (page = 1) => async (dispatch) => {
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const response = await api.getRecommendedArticles(page);
        dispatch({
            type: FETCH_ARTICLES_SUCCESS,
            payload: {
                articles: response.recommendations,
                currentPage: page,
                totalPages: response.totalPages,
            }
        });
    } catch (error) {
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message || 'Failed to fetch articles'
        });
    }
};

export const searchArticlesAction = (query, page = 1, limit = 20) => async (dispatch) => {
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const response = await api.searchArticles(query, page, limit);
        dispatch({
            type: SEARCH_ARTICLES,
            payload: {
                articles: response.articles,
                currentPage: page,
                totalPages: response.totalPages
            }
        });
    } catch (error) {
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message || 'Failed to search articles'
        });
    }
};

export const saveArticleAction = (article) => async (dispatch) => {
    console.log('saveArticleAction called with article:', article);
    try {
        if (!article || !article._id) {
            throw new Error('Invalid article object: Missing _id');
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
        dispatch({
            type: SAVE_ARTICLE_FAILURE,
            payload: error.response?.data?.message || error.message || 'Failed to save article'
        });
        throw error;
    }
};

export const setSelectedArticle = (articleId) => ({
    type: SET_SELECTED_ARTICLE,
    payload: articleId,
});

export const fetchSavedArticles = () => async (dispatch) => {
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const savedArticles = await api.getSavedArticles();
        console.log('Saved articles received:', savedArticles);
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

export const deleteArticleAction = (articleId) => async (dispatch, getState) => {
    console.log('deleteArticleAction called with articleId:', articleId);
    try {
        const response = await api.deleteArticle(articleId);
        console.log('Delete response:', response);

        dispatch({
            type: DELETE_ARTICLE,
            payload: articleId
        });

        const { currentPage } = getState().articles;
        dispatch(fetchArticles(currentPage));

        return { success: true, message: response.message || 'Article deleted successfully' };
    } catch (error) {
        console.error('Error deleting article:', error);
        dispatch({
            type: DELETE_ARTICLE_FAILURE,
            payload: error.message || 'Failed to delete article'
        });
        throw error;
    }
};


export const unsaveArticleAction = (article) => async (dispatch) => {
    console.log('unsaveArticleAction called with article:', article);
    const articleId = article._id;
    if (!articleId) {
        console.error('Attempted to unsave article with undefined id');
        return { success: false, message: 'Invalid article ID' };
    }
    try {
        const response = await api.unsaveArticle(articleId);
        console.log('Unsave response:', response);
        dispatch({
            type: UNSAVE_ARTICLE,
            payload: articleId
        });
        return { success: true, message: response.message || 'Article unsaved successfully' };
    } catch (error) {
        console.error('Error unsaving article:', error);
        dispatch({
            type: UNSAVE_ARTICLE_FAILURE,
            payload: error.message || 'Failed to unsave article'
        });
        throw error;
    }
};
export const searchSavedArticlesAction = (query) => async (dispatch) => {
    console.log('searchSavedArticlesAction called with query:', query);
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const response = await api.searchSavedArticles(query);
        console.log('Saved articles search response:', response);
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