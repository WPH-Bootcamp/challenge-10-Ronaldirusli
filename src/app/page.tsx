'use client';

import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/api/axios';
import Link from 'next/link';
import Image from 'next/image';

type Restaurant = {
  id: string;
  logo?: string;
  name: string;
  location?: string;
  rating?: string;
  distance?: string;
};

type RestaurantApiResponse = {
  data: {
    restaurants: Restaurant[];
  };
};

//fungsi fetching data dari API
const fetchRestaurant = async (): Promise<Restaurant[]> => {
  const response = await axiosInstance.get<RestaurantApiResponse>('/api/resto');
  console.log(response.data.data.restaurants);
  return response.data.data.restaurants;
};

export default function HomePage() {
  const {
    data: restaurant,
    isLoading,
    error,
  } = useQuery<Restaurant[]>({
    queryKey: ['restaurant'],
    queryFn: fetchRestaurant,
  });

  if (isLoading)
    return (
      <div className='p-10 text-center'>
        Loading restoran pilihan untukmu...
      </div>
    );
  if (error)
    return (
      <div className='p-10 text-center text-red-500'>
        Gagal loading... {JSON.stringify(error)}
      </div>
    );

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6 text-slate-800'>
        Daftar Restaurant
      </h1>
      <Link
        href='/auth/register'
        className='bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition'
      >
        Register
      </Link>
      <Link
        href='/auth/login'
        className='bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition'
      >
        Login
      </Link>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {Array.isArray(restaurant) &&
          restaurant.map((resto: Restaurant) => (
            <Link
              href={`/auth/main/resto/${resto.id}`}
              key={resto.id}
              className='block group'
            >
              <div className='border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white'>
                <Image
                  src={resto.logo || '/placeholder-resto.jpg'}
                  alt={resto.name}
                  width={100}
                  height={100}
                  className='w-full h-48 object-cover group-hover:scale-105 transition duration-300'
                />
                <div className='p-4'>
                  <h2 className='text-xl font-bold group-hover:text-amber-500 transition'>
                    {resto.name}
                  </h2>
                  <p className='text-sm text-slate-500 mt-1'>
                    {resto.location || 'Jakarta'}
                  </p>
                  <div className='flex items-center justify-between mt-4'>
                    <span className='text-amber-500 font-semibold'>
                      ★{resto.rating || '4.5'}
                    </span>
                    <span className='text-xs text-slate-400'>
                      {resto.distance || '1.2km'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </main>
  );
}
