export interface User {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    role: string;
    is_active: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface SignupData {
    username: string;
    email: string;
    full_name?: string;
    password: string;
    role: string;
}

export interface AuthToken {
    access_token: string;
    token_type: string;
}

export interface FoodEntry {
    id: number;
    user: string;
    food: string;
    quantity: number;
    is_safe: boolean;
    date: string;
}

export interface FoodEntryCreate {
    user: string;
    food: string;
    quantity: number;
    is_safe: boolean;
    date: string;
}

export interface ApiResponse<T> {
    message: string;
    data?: T;
}
