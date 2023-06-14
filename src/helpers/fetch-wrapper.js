import { useAuthStore } from '@/stores';
import axios from "axios"

export const fetchWrapper = {
    get: request('GET'),
    post: request('POST'),
    put: request('PUT'),
    delete: request('DELETE')
};

function request(method) {
    return (url, body) => {
        const requestOptions = {
            method,
            url,
            headers: authHeader(url)
        };
        if (body) {
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.data = JSON.stringify(body);
        }

        try {
            return axios(requestOptions).then(handleResponse);

        } catch (error) {
            console.log(error)
        }
    }
}

// helper functions

function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const { user } = useAuthStore();
    const isLoggedIn = !!user?.token;
    const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
    if (isLoggedIn) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
}

async function handleResponse(response) {
    return response.data;
}