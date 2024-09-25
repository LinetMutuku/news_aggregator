import axios from 'axios';
import axiosRetry from 'axios-retry';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000 // 10 seconds timeout
});

// Implement retry logic
axiosRetry(api, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
    }
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access, redirecting to login');
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});

// Helper function for API calls
const apiCall = async (method, url, data = null, params = null) => {
    try {
        const response = await api({ method, url, data, params });
        return response.data;
    } catch (error) {
        console.error(`Error in ${method.toUpperCase()} ${url}:`, error);
        throw error;
    }
};

// Authentication
export const login = async (username, password) => {
    const response = await apiCall('post', '/auth/login', { username, password });
    if (response.token) {
        localStorage.setItem('token', response.token);
    }
    return response;
};

export const register = async (username, email, password) => {
    const response = await apiCall('post', '/auth/register', { username, email, password });
    if (response.token) {
        localStorage.setItem('token', response.token);
    }
    return response;
};

export const logout = () => {
    localStorage.removeItem('token');
};

// Articles
export const getRecommendedArticles = (page = 1, limit = 20) => apiCall('get', '/articles/recommended', null, { page, limit });

export const getAllArticles = (page = 1, limit = 20, category = '', search = '') => apiCall('get', '/articles', null, { page, limit, category, search });

export const getArticleById = async (id) => {
    if (!id) {
        console.warn('Attempted to get article with null/undefined id');
        return null;
    }
    return await apiCall('get', `/articles/${id}`);
};

export const markArticleAsRead = (articleId) => apiCall('post', `/articles/${articleId}/read`);

// Search articles
export const searchArticles = (query, page = 1, limit = 20) => apiCall('get', '/articles/search', null, { query, page, limit });

// User Preferences
export const getUserPreferences = () => apiCall('get', '/users/preferences');

export const updateUserPreferences = (preferences) => apiCall('put', '/users/preferences', preferences);

// Saved Articles
export const getSavedArticles = () => apiCall('get', '/users/saved-articles');

export const searchSavedArticles = (query) => apiCall('get', '/users/saved-articles/search', null, { query });

export const saveArticle = async (article) => {
    console.log('Saving article:', article);
    try {
        const response = await apiCall('post', '/users/save-article', { articleId: article._id });
        console.log('Article saved successfully:', response);
        return response;
    } catch (error) {
        console.error('Error saving article:', error.response?.data || error.message);
        throw error;
    }
};

export const unsaveArticle = async (articleId) => {
    console.log('Unsaving article with ID:', articleId);
    try {
        const response = await apiCall('delete', `/users/unsave-article/${articleId}`);
        console.log('Article unsaved successfully:', response);
        return response;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log('Article not found, considering it already unsaved');
            return { message: 'Article was already unsaved' };
        }
        console.error('Error unsaving article:', error.response?.data || error.message);
        throw error;
    }
};

// User Profile
export const getUserProfile = () => apiCall('get', '/users/profile');

export const updateUserProfile = (profileData) => apiCall('put', '/users/profile', profileData);

export default api;