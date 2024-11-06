"use client";

import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check if a token exists in localStorage when the component mounts
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Fetch user details if necessary or set user state directly
            setUser({ access_token: token });
        }
    }, []);

    const login = async (username, password) => {
        try {
            const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            const response = await axios.post(`http://${backendURL}/auth/token`, formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });
            
            const token = response.data.access_token;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            localStorage.setItem('token', token);
            setUser({ access_token: token });
            router.push('/');
        } catch (error) {
            console.log('Login Failed: ', error);
            return error.response?.data?.detail;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
