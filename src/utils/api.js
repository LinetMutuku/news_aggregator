import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000 // 10 seconds timeout
});

// Request interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
}, (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use((response) => {
    console.log(`Received response from ${response.config.url}:`, response.status);
    return response;
}, (error) => {
    if (error.response) {
        console.error(`Error response from ${error.config.url}:`, error.response.status, error.response.data);
        if (error.response.status === 401) {
            console.warn('Unauthorized access, redirecting to login');
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    } else if (error.request) {
        console.error('No response received:', error.request);
    } else {
        console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
});

// Helper function for API calls
const apiCall = async (method, url, data = null, params = null) => {
    try {
        const response = await api({
            method,
            url,
            data,
            params
        });
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
export const getRecommendedArticles = (page = 1, limit = 20) =>
    apiCall('get', `/articles/recommended`, null, { page, limit });

export const getAllArticles = (page = 1, limit = 20, category = '', search = '') =>
    apiCall('get', '/articles', null, { page, limit, category, search });

export const getArticleById = (id) =>
    apiCall('get', `/articles/${id}`);

export const markArticleAsRead = (articleId) =>
    apiCall('post', `/articles/${articleId}/read`);

// Search articles
export const searchArticles = (query, page = 1, limit = 20) =>
    apiCall('get', '/articles/search', null, { query, page, limit });

// User Preferences
export const getUserPreferences = () =>
    apiCall('get', '/users/preferences');

export const updateUserPreferences = (preferences) =>
    apiCall('put', '/users/preferences', preferences);

// Saved Articles
export const getSavedArticles = () =>
    apiCall('get', '/users/saved-articles');

export const searchSavedArticles = (query) =>
    apiCall('get', '/users/saved-articles/search', null, { query });

export const saveArticle = (article) =>
    apiCall('post', '/users/save-article', article);

export const unsaveArticle = (articleId) =>
    apiCall('delete', `/users/saved-articles/${articleId}`);

// User Profile
export const getUserProfile = () =>
    apiCall('get', '/users/profile');

export const updateUserProfile = (profileData) =>
    apiCall('put', '/users/profile', profileData);

export default api;