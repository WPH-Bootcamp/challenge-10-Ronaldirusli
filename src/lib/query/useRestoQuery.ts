import { useQuery } from '@tanstack/react-query';
import { restoAPI } from '../api/resto';

export const restoKeys = {
  all: ['restaurants'] as const,
  detail: (id: string) => [...restoKeys.all, id] as const,
  menus: (id: string) => [...restoKeys.detail(id), 'menus'] as const,
  review: (id: string) => [...restoKeys.detail(id), 'reviews'] as const,
};

export function useRestaurants() {
  return useQuery({
    queryKey: restoKeys.all,
    queryFn: restoAPI.getRestaurants,
  });
}

export function useRestaurantById(id: string) {
  return useQuery({
    queryKey: restoKeys.detail(id),
    queryFn: () => restoAPI.getRestaurantById(id),
    enabled: !!id,
  });
}

export function useRestaurantMenus(id: string) {
  return useQuery({
    queryKey: restoKeys.menus(id),
    queryFn: () => restoAPI.getMenusByRestaurant(id),
    enabled: !!id,
  });
}
