// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://taskmanagment-api.onrender.com',
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;