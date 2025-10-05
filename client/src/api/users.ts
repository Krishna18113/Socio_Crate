import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interface for profile update data, aligning with the backend controller
interface UpdateData {
    name?: string;
    profilePic?: string | null;
    description?: string | null;
}

// 🔑 UPDATED: Now points to the new backend route: /users/profile/:id
export const getUserById = async (id: string) => {
    try {
        const response = await API.get(`/users/profile/${id}`);
        return response;
    } catch (error) {
        console.error(`Error fetching user profile with ID ${id}:`, error);
        throw error;
    }
};

// 🔑 NEW: Function to update the authenticated user's profile
export const updateProfile = async (data: UpdateData) => {
    // This calls the PUT /users/profile route
    const res = await API.put('/users/profile', data);
    return res.data;
};

export const getFollowers = async (userId: string) => {
    try {
        const response = await API.get(`/follow/${userId}/followers`);
        return response;
    } catch (error) {
        console.error(`Error fetching followers of user ${userId}:`, error);
        throw error;
    }
};

export const getFollowing = async (userId: string) => {
    try {
        const response = await API.get(`/follow/${userId}/following`);
        return response;
    } catch (error) {
        console.error(`Error fetching following list of user ${userId}:`, error);
        throw error;
    }
};

// Function to delete profile picture
export const deleteProfilePic = async () => {
    const res = await API.delete("/users/profile-pic"); // This calls your backend's DELETE route
    return res.data;
};

