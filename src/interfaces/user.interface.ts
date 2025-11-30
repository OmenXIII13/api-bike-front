export interface Profile {
	id: number;
	email: string;
	address: string;
	name: string;
	phone: string;
}
export interface User {
	id: number;
	email: string;
	name: string;
}
export interface LoginResponse {
	access_token: string;
	user?: User;
}

export interface RegisterResponse {
	access_token: string;
	user?: User;
}