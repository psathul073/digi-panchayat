import axios from 'axios';
import { auth } from '../config/firebase'


// Default config...
const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Allow cookies & sessions to be sent
});

// For Add service.
const addService = async (data) => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.post('/service/add', data, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;

    } catch (error) {
        console.error("Add service error:", error);
        return error.response?.data;
    }

};

// For Edit service.
const editService = async (data) => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.post('/service/edit', data, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;

    } catch (error) {
        console.error("Edit service error:", error);
        return error.response?.data;
    }

};

// Update service.
const deleteService = async (id) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.delete('/service/delete', {
            headers: { Authorization: `Bearer ${token}` },
            params: { serviceId: id }
        });

        return res.data;

    } catch (error) {
        console.error("Delete service error:", error);
        return error.response?.data;
    }
};

// For fetch single service.
const fetchService = async (id) => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/service/get', {
            headers: { Authorization: `Bearer ${token}` },
            params: { serviceId: id }
        });

        return res.data;

    } catch (error) {
        console.error("fetch service error:", error);
        return error.response?.data;
    }

};

// For fetch all services.
const fetchAllServices = async (nextCursor, searchTerm, limit) => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/service/get-all', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: limit,
                startAfter: nextCursor,
                searchTerm: searchTerm,
            }
        });

        return res.data;

    } catch (error) {
        console.error("fetch all services error:", error);
        return error.response?.data;
    }

};

// For fetch all services.
const fetchAllLogs = async (nextCursor, limit) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/logs/get', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: limit,
                startAfter: nextCursor,
            }
        });

        return res.data;

    } catch (error) {
        console.error("fetch all logs error:", error);
        return error.response?.data;
    }
};

// For fetch all users.
const fetchAllUsers = async (nextCursor, searchTerm, limit) => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/users/get', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: limit,
                startAfter: nextCursor,
                searchTerm: searchTerm,
            }
        });

        return res.data;

    } catch (error) {
        console.error("fetch all users error:", error);
        return error.response?.data;
    }

};

// For delete users.
const deleteUsers = async (id) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.delete('/users/delete', {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId: id }
        });

        return res.data;

    } catch (error) {
        console.error("Delete user error:", error);
        return error.response?.data;
    }
};

// For status.
const fetchStatus = async () => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/status/admin', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;

    } catch (error) {
        console.error("fetch status error:", error);
        return error.response?.data;
    }

};

// Fore send updates.
const sendUpdates = async (data) => {

    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.post('/service/send', data, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;

    } catch (error) {
        console.error("Send updates API error:", error);
        return error.response?.data;
    }

};


export { addService, editService, deleteService, fetchService, fetchAllServices, fetchAllLogs, fetchAllUsers, deleteUsers, fetchStatus, sendUpdates }