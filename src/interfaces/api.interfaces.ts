// src/interfaces/api.interfaces.ts
export interface BackendProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  ingredients?: string[];
  image: string;
  rating?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  access_token: string;
}

export interface OrderRequest {
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  deliveryFee: number;
}