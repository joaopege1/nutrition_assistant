import axios from 'axios';
import type { FoodEntry, User } from '../types';
import { config } from '../config';

const API_BASE_URL = config.apiUrl;

export const adminService = {
    async getAllFoodEntries(): Promise<FoodEntry[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/admin/foods/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar todas as entradas de comida:', error);
            throw error;
        }
    },

    async updateFoodEntrySafety(id: number, isSafe: boolean): Promise<{ message: string; food_entry: any }> {
        try {
            const response = await axios.put(`${API_BASE_URL}/auth/admin/food_entry/${id}`, null, {
                params: { is_safe: isSafe }
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar segurança da entrada:', error);
            throw error;
        }
    },

    async deleteFoodEntry(id: number): Promise<{ message: string }> {
        try {
            const response = await axios.delete(`${API_BASE_URL}/auth/admin/food_entry/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao deletar entrada de comida:', error);
            throw error;
        }
    },

    async getAllUsers(): Promise<User[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/auth/admin/users/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar todos os usuários:', error);
            throw error;
        }
    },

    async updateUserRole(userId: number, role: string): Promise<{ message: string; user: User }> {
        try {
            const response = await axios.put(`${API_BASE_URL}/auth/admin/users/${userId}/role`, { role });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar role do usuário:', error);
            throw error;
        }
    }
};
