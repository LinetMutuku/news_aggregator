import { getRecommendedArticles, searchArticles, saveArticle, getArticleById, getSavedArticles, unsaveArticle, searchSavedArticles } from '../../utils/api';

export const FETCH_ARTICLES_REQUEST = 'FETCH_ARTICLES_REQUEST';
export const FETCH_ARTICLES_SUCCESS = 'FETCH_ARTICLES_SUCCESS';
export const FETCH_ARTICLES_FAILURE = 'FETCH_ARTICLES_FAILURE';
export const SEARCH_ARTICLES = 'SEARCH_ARTICLES';
export const SAVE_ARTICLE = 'SAVE_ARTICLE';
export const SET_SELECTED_ARTICLE = 'SET_SELECTED_ARTICLE';
export const FETCH_SAVED_ARTICLES = 'FETCH_SAVED_ARTICLES';
export const UNSAVE_ARTICLE = 'UNSAVE_ARTICLE';
export const SEARCH_SAVED_ARTICLES = 'SEARCH_SAVED_ARTICLES';

export const fetchArticles = (page) => async (dispatch) => {
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const response = await getRecommendedArticles(page);
        dispatch({
            type: FETCH_ARTICLES_SUCCESS,
            payload: response.recommendations,
            totalPages: response.totalPages
        });
    } catch (error) {
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message
        });
    }
};

export const searchArticlesAction = (query) => async (dispatch) => {
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const response = await searchArticles(query);
        dispatch({
            type: SEARCH_ARTICLES,
            payload: response.articles
        });
    } catch (error) {
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message
        });
    }
};

export const saveArticleAction = (article) => async (dispatch) => {
    try {
        await saveArticle(article);
        dispatch({
            type: SAVE_ARTICLE,
            payload: article._id
        });
    } catch (error) {
        console.error('Error saving article:', error);
    }
};

export const setSelectedArticle = (articleId) => async (dispatch) => {
    try {
        const article = await getArticleById(articleId);
        dispatch({
            type: SET_SELECTED_ARTICLE,
            payload: article
        });
    } catch (error) {
        console.error('Error fetching article:', error);
    }
};

export const fetchSavedArticles = () => async (dispatch) => {
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const articles = await getSavedArticles();
        dispatch({
            type: FETCH_SAVED_ARTICLES,
            payload: articles
        });
    } catch (error) {
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message
        });
    }
};

export const unsaveArticleAction = (articleId) => async (dispatch) => {
    try {
        await unsaveArticle(articleId);
        dispatch({
            type: UNSAVE_ARTICLE,
            payload: articleId
        });
    } catch (error) {
        console.error('Error unsaving article:', error);
    }
};

export const searchSavedArticlesAction = (query) => async (dispatch) => {
    dispatch({ type: FETCH_ARTICLES_REQUEST });
    try {
        const results = await searchSavedArticles(query);
        dispatch({
            type: SEARCH_SAVED_ARTICLES,
            payload: results
        });
    } catch (error) {
        dispatch({
            type: FETCH_ARTICLES_FAILURE,
            payload: error.message
        });
    }
};