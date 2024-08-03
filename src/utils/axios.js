import axios from 'axios';

const instance = axios.create({
    baseURL: 'task-server-hj49p0tm3-leylagahramanovas-projects.vercel.app/api',
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
