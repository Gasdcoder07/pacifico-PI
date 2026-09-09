import axios from "axios";

export const apiClient = axios.create({
    headers : {
        'Content-Type' : 'application/json'
    },
});

apiClient.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token")

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)