import axios from 'axios';
import type { FoodEntry } from '../types';

const API_BASE_URL = 'http://localhost:8000';

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
    }
};
