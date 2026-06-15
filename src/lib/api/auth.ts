import { axiosInstance } from './axios';

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: string; // Bisa di-parse ke Date nanti jikadiperlukan
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosInstance.post('/auth/login', payload);
    return response.data;
  },
  register: async (payload: RegisterPayload) => {
    const response = await axiosInstance.post('/auth/register', payload);
    return response.data;
  },
};
