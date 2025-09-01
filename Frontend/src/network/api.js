import axios from "axios";

const API_URL = 'http://localhost:9090/api';

const api = axios.create({
    baseURL: API_URL,
    headers:{
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
})

api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
        config.headers['X-User-ID'] = userId;
    }
    return config;
});

export const API_AGENT = {
    Activities: {
        getActivities: async () => api.get('/activity'),
        getActivity: async (id) => api.get(`/activity/${id}`),
        getActivityRecommendations: async (id) => api.get(`/recommendations/activity/${id}`),
        createActivity: async (activity) => api.post('/activity', activity),
        updateActivity: async (id, activity) => api.put(`/activity/${id}`, activity),
        deleteActivity: async (id) => api.delete(`/activity/${id}`)
    }
}
