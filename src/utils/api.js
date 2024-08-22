import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
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
    try {
        console.log('Attempting login with username:', username);
        const response = await api.post('/auth/login', { username, password });
        console.log('Login response:', response.data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Login Error:', error);
        throw error;
    }
};

export const register = async (username, email, password) => {
    try {
        console.log('Attempting registration with username:', username);
        const response = await api.post('/auth/register', { username, email, password });
        console.log('Registration response:', response.data);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        console.error('Registration Error:', error);
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    console.log('User logged out');
};

// Articles
export const getRecommendedArticles = async (page = 1, limit = 20) => {
    try {
        const response = await api.get(`/articles/recommended?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Get Recommended Articles Error:', error);
        throw error;
    }
};

export const getAllArticles = async (page = 1, limit = 20, category = '', search = '') => {
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
    try {
        const response = await api.get(`/articles/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get Article By ID Error:', error);
        throw error;
    }
};

export const markArticleAsRead = async (articleId) => {
    try {
        const response = await api.post(`/articles/${articleId}/read`);
        return response.data;
    } catch (error) {
        console.error('Mark Article as Read Error:', error);
        throw error;
    }
};

// User Preferences
export const getUserPreferences = async () => {
    try {
        const response = await api.get('/users/preferences');
        return response.data;
    } catch (error) {
        console.error('Get User Preferences Error:', error);
        throw error;
    }
};

export const updateUserPreferences = async (preferences) => {
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
    try {
        const response = await api.get('/users/saved-articles');
        return response.data;
    } catch (error) {
        console.error('Get Saved Articles Error:', error);
        throw error;
    }
};

export const saveArticle = async (article) => {
    try {
        const response = await api.post('/users/save-article', article);
        return response.data;
    } catch (error) {
        console.error('Save Article Error:', error);
        throw error;
    }
};
export const unsaveArticle = async (articleId) => {
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
    try {
        const response = await api.get('/users/profile');
        return response.data;
    } catch (error) {
        console.error('Get User Profile Error:', error);
        throw error;
    }
};

export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    } catch (error) {
        console.error('Update User Profile Error:', error);
        throw error;
    }
};

export default api;