import { axiosInstance } from './axios';

export interface OrderPayload {
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  totalPrice: number;
}

export interface OrderResponse {
  id: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  totalPrice: number;
  status?: string;
  createdAt?: string;
}

export interface OrderHistoryItem {
  id: string;
  totalPrice: number;
  status: 'Pending' | 'Success' | 'Cancelled';
  createAt: string;
  items: {
    id: string;
    quantity: number;
    menuItem: {
      name: string;
      price: number;
      image: string;
    };
  }[];
}

export const orderApi = {
  createOrder: async (payLoad: OrderPayload): Promise<OrderResponse> => {
    const response = await axiosInstance.post('/order', payLoad);
    return response.data;
  },

  getOrder: async (): Promise<OrderHistoryItem[]> => {
    const response = await axiosInstance.get('/order');
    return response.data;
  },
};
