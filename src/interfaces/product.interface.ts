// src/interfaces/product.interface.ts
export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	rating: number;
	ingredients: string[];
	type: 'pizza' | 'drink' | 'snack' | 'dessert' | 'other';
}

export interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  ingredients: string[];
  image: string;
  rating: number;
  type: 'pizza' | 'drink' | 'snack' | 'dessert'; // Добавляем тип продукта
}