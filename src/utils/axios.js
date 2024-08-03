import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://task-server-mqvfko2uw-leylagahramanovas-projects.vercel.app/api',
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
