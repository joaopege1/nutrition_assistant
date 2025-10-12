import axios from 'axios';
import type { FoodEntry, FoodEntryCreate } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const foodService = {
    async getFoodEntries(): Promise<FoodEntry[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/foods/`);
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar entradas de comida:', error);
            throw error;
        }
    },

    async createFoodEntry(foodEntry: FoodEntryCreate): Promise<{ message: string; food_entry: FoodEntryCreate }> {
        try {
            const response = await axios.post(`${API_BASE_URL}/food_entry/`, foodEntry);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar entrada de comida:', error);
            throw error;
        }
    },

    async updateFoodEntry(id: number, foodEntry: FoodEntryCreate): Promise<{ message: string; food_entry: FoodEntryCreate }> {
        try {
            const response = await axios.put(`${API_BASE_URL}/food_entry/${id}`, foodEntry);
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar entrada de comida:', error);
            throw error;
        }
    },

    async deleteFoodEntry(id: number): Promise<{ message: string }> {
        try {
            const response = await axios.delete(`${API_BASE_URL}/food_entry/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao deletar entrada de comida:', error);
            throw error;
        }
    }
};
