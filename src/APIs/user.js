import axios from 'axios';
import { auth } from '../config/firebase'


// Default config...
const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true, // Allow cookies & sessions to be sent
});

// 

// For submit requests.
const submitRequest = async (formData, serviceId) => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.post('/requests/submit', formData, {
            headers: { Authorization: `Bearer ${token}` },
            params: { serviceId },
        });

        return res.data;

    } catch (error) {
        console.error("Requests API error:", error);
        return error.response?.data || null;
    }

};

// For fetch all user requests.
const fetchAllRequest = async (nextCursor, limit) => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/requests/user-get-all', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: limit,
                startAfter: nextCursor,
            }
        });

        return res.data;

    } catch (error) {
        console.error("Fetch user all requests API error:", error);
        return error.response?.data || null;
    }

};

// For fetch user request by id.
const fetchRequest = async (requestId, token) => {

    try {
        const res = await API.get('/requests/user-get', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                requestId
            }
        });

        return res.data;

    } catch (error) {
        console.error("Fetch user request API error:", error);
        return error.response?.data || null;
    }

};

// For status.
const fetchStatus = async () => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/status/user', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;

    } catch (error) {
        console.error("fetch status error:", error);
        return error.response?.data;
    }

};

// For fetch important updates.
// Fore send updates.
const fetchUpdates = async () => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/service/update-get', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;

    } catch (error) {
        console.error("Fetch updates API error:", error);
        return error.response?.data;
    }

};

export { submitRequest, fetchAllRequest, fetchRequest, fetchStatus, fetchUpdates }