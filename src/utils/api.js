import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create an axios instance with custom config
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Important for sending cookies, if used
});

// Request interceptor
api.interceptors.request.use((config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    console.log('Interceptor: Preparing request with token:', token ? 'Token exists' : 'No token');

    // If token exists, add it to the headers
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // Handle request errors here
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    console.log(`Response received for ${response.config.url}:`, response.status);
    return response;
}, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response) {
        console.error('Response Error Data:', error.response.data);
        console.error('Response Error Status:', error.response.status);
        console.error('Response Error Headers:', error.response.headers);
    } else if (error.request) {
        console.error('Request Error:', error.request);
    } else {
        console.error('Error Message:', error.message);
    }
    console.error('Error Config:', error.config);
    return Promise.reject(error);
});

// Authentication
export const login = async (username, password) => {
    console.log('Attempting login for user:', username);
    try {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.token) {
            console.log('Login successful, storing token');
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
};

export const register = async (username, email, password) => {
    console.log('Attempting registration for user:', username);
    try {
        const response = await api.post('/auth/register', { username, email, password });
        if (response.data.token) {
            console.log('Registration successful, storing token');
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Registration Error:', error);
        throw error;
    }
};

export const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('token');
};

// Articles
export const getRecommendedArticles = async (page = 1, limit = 20) => {
    console.log(`Fetching recommended articles. Page: ${page}, Limit: ${limit}`);
    try {
        const response = await api.get(`/articles/recommended?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Get Recommended Articles Error:', error);
        throw error;
    }
};

export const getAllArticles = async (page = 1, limit = 20, category = '', search = '') => {
    console.log(`Fetching all articles. Page: ${page}, Limit: ${limit}, Category: ${category}, Search: ${search}`);
    try {
        const response = await api.get('/articles', {
            params: { page, limit, category, search }
        });
        return response.data;
    } catch (error) {
        console.error('Get All Articles Error:', error);
        throw error;
    }
};

export const getArticleById = async (id) => {
    console.log(`Fetching article by ID: ${id}`);
    try {
        if (!id || typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) {
            throw new Error('Invalid article ID');
        }
        const response = await api.get(`/articles/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get Article By ID Error:', error);
        throw error;
    }
};

export const markArticleAsRead = async (articleId) => {
    console.log(`Marking article as read. Article ID: ${articleId}`);
    try {
        const response = await api.post(`/articles/${articleId}/read`);
        return response.data;
    } catch (error) {
        console.error('Mark Article as Read Error:', error);
        throw error;
    }
};

// Search articles
export const searchArticles = async (query, page = 1, limit = 20) => {
    console.log(`Searching articles. Query: ${query}, Page: ${page}, Limit: ${limit}`);
    try {
        const response = await api.get('/articles', {
            params: { search: query, page, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Search Articles Error:', error);
        throw error;
    }
};

// User Preferences
export const getUserPreferences = async () => {
    console.log('Fetching user preferences');
    try {
        const response = await api.get('/users/preferences');
        return response.data;
    } catch (error) {
        console.error('Get User Preferences Error:', error);
        throw error;
    }
};

export const updateUserPreferences = async (preferences) => {
    console.log('Updating user preferences:', preferences);
    try {
        const response = await api.put('/users/preferences', { preferences });
        return response.data;
    } catch (error) {
        console.error('Update User Preferences Error:', error);
        throw error;
    }
};

// Saved Articles
export const getSavedArticles = async () => {
    console.log('Fetching saved articles');
    try {
        const response = await api.get('/users/saved-articles');
        return response.data;
    } catch (error) {
        console.error('Get Saved Articles Error:', error);
        throw error;
    }
};

export const searchSavedArticles = async (query) => {
    console.log(`Searching saved articles. Query: ${query}`);
    try {
        const response = await api.get('/users/saved-articles', {
            params: { search: query }
        });
        return response.data;
    } catch (error) {
        console.error('Search Saved Articles Error:', error);
        throw error;
    }
};

export const saveArticle = async (article) => {
    console.log('Saving article:', article);
    try {
        const articleToSave = {
            ...article,
            articleId: article._id,
            source: typeof article.source === 'object' ? article.source.name : article.source
        };
        const response = await api.post('/users/save-article', articleToSave);
        return response.data;
    } catch (error) {
        console.error('Save Article Error:', error);
        throw error;
    }
};

export const unsaveArticle = async (articleId) => {
    console.log(`Unsaving article. Article ID: ${articleId}`);
    try {
        const response = await api.delete(`/users/saved-article/${articleId}`);
        return response.data;
    } catch (error) {
        console.error('Unsave Article Error:', error);
        throw error;
    }
};

// User Profile
export const getUserProfile = async () => {
    console.log('Fetching user profile');
    try {
        const response = await api.get('/users/profile');
        return response.data;
    } catch (error) {
        console.error('Get User Profile Error:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    console.log('Updating user profile:', profileData);
    try {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Update User Profile Error:', error);
        throw error;
    }
};

export default api;