import axios from 'axios';
import type { LoginCredentials, SignupData, User, AuthToken } from '../types';

const API_BASE_URL = 'http://localhost:8000';

// Configurar axios para incluir token automaticamente
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    async login(credentials: LoginCredentials): Promise<AuthToken> {
        try {
            const formData = new FormData();
            formData.append('username', credentials.username);
            formData.append('password', credentials.password);
            
            const response = await axios.post(`${API_BASE_URL}/auth/tokens`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        } catch (error: any) {
            console.error('Erro no login:', error);
            throw error;
        }
    },

    async signup(data: SignupData): Promise<{ message: string; user: SignupData }> {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/`, data);
            return response.data;
        } catch (error) {
            console.error('Erro no cadastro:', error);
            throw error;
        }
    },

    async getCurrentUser(): Promise<User> {
        try {
            const response = await axios.get(`${API_BASE_URL}/users/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            throw error;
        }
    },

    async changePassword(userData: { username: string; password: string }): Promise<{ message: string }> {
        try {
            const response = await axios.put(`${API_BASE_URL}/users/password`, userData);
            return response.data;
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            throw error;
        }
    },

    logout(): void {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    },

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }
};
