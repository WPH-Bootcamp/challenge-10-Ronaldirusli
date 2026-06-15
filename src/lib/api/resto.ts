import axios from 'axios';
import { axiosInstance } from './axios';
import { Restaurant, MenuItem, Review } from '@/types';

export const restoAPI = {
  getRestaurants: async (): Promise<Restaurant[]> => {
    const response = await axiosInstance.get('restaurant');
    return response.data;
  },
  getRestaurantById: async (id: string): Promise<Restaurant> => {
    const response = await axiosInstance.get(`/restaurant/${id}`);
    return response.data;
  },
  getMenusByRestaurant: async (restaurantId: string): Promise<MenuItem[]> => {
    const response = await axiosInstance.get(
      `/restaurant/${restaurantId}/menus`
    );
    return response.data;
  },
  getReviewByRestaurant: async (restaurantId: string): Promise<Review[]> => {
    const response = await axiosInstance.get(
      `/restaurant/${restaurantId}/reviews`
    );
    return response.data;
  },
};
