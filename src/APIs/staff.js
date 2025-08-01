import axios from 'axios';
import { auth } from '../config/firebase'


// Default config...
const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // Allow cookies & sessions to be sent
});

const fetchUsersPendingReq = async (limit, searchTerm, sortOrder, nextCursor) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/requests/get-pending-all', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: limit,
                startAfter: nextCursor,
                searchTerm: searchTerm,
                sortOrder: sortOrder,
            }
        });

        return res.data;

    } catch (error) {
        console.error("Fetch all users pending requests API errors,", error);
        return error?.response?.data;
    }
};

const fetchUsersReqDetails = async (requestId) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/requests/user-get', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                requestId
            }
        });

        return res.data;

    } catch (error) {
        console.error("Fetch users requests details API errors,", error);
        return error?.response?.data;
    }
};

const fetchUsersAllReq = async (limit, searchTerm, nextCursor) => {
    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/requests/get-all', {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                limit: limit,
                startAfter: nextCursor,
                searchTerm: searchTerm,
            }
        });

        return res.data;

    } catch (error) {
        console.error("Fetch users all requests API errors,", error);
        return error?.res?.data;
    }
};

const approveRequest = async (requestId) => {
    try {
        const token = await auth.currentUser.getIdToken();

        const res = await API.post('/requests/approve', { requestId }, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data;

    } catch (error) {
        console.error("Approve request API errors,", error);
        return error?.response?.data;
    }
};

const rejectedRequest = async (data) => {
    try {
        const token = await auth.currentUser.getIdToken();

        const res = await API.post('/requests/reject', data, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data;

    } catch (error) {
        console.error("Reject request API errors,", error);
        return error?.response?.data;
    }
};

const fetchStatus = async () => {
    try {
        const token = await auth.currentUser.getIdToken();
        const res = await API.get('/status/staff', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return res.data;

    } catch (error) {
        console.error("Fetch requests status details API errors,", error);
        return error?.response?.data;
    }
};


export { fetchUsersPendingReq, fetchUsersReqDetails, fetchUsersAllReq, approveRequest, rejectedRequest, fetchStatus }