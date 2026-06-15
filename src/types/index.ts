export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  totalReviews: number;
  location: string;
  distance: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  image: string;
  category: 'food' | 'drink';
}

export interface Review {
  id: string;
  restaurantId: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  avatar?: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantName: string;
  item: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  status: 'Pending' | 'Success' 'Cancelled';
  createdAt: string;
}
