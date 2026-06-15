'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { restoAPI } from '@/lib/api/resto';
import { useCartStore } from '@/store/useCartStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function RestaurantDetailPage() {
  const { id } = useParams() as { id: string };
  const [activeCatergory, setActiveCategory] = useState('all');

  //zustand cart state
  const { cartItems, addToCart, updateQuantity } = useCartStore();

  //fetch detail resto
  const { data: resto, isLoading: isRestoLoading } = useQuery({
    queryKey: ['restaurant', id],
    queryFn: () => restoAPI.getRestaurantById(id),
  });

  //fetch menu resto
  const { data: menus, isLoading: isMenuLoading } = useQuery({
    queryKey: ['restaurant', id, 'menus'],
    queryFn: () => restoAPI.getMenusByRestaurant(id),
  });

  if (isRestoLoading || isMenuLoading) {
    return (
      <div className='p-10 text-center text-slate-500'>
        Memuat menu lezat untukmu...
      </div>
    );
  }

  //filter menu berdasarkan tab kategori all menu, food, drink
  const filteredMenus = menus?.filter((item) => {
    if (activeCatergory === 'all') return true;
    return item.category === activeCatergory;
  });

  return (
    <main className='container mx-auto px-4 py-8 bg-slate-50 min-h-screen'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='md:col-span-2'>
          <img
            src={resto?.image || '/placeholder-resto.jpg'}
            alt={resto?.name}
            className='w-full h-350px object-cover rounded-2xl shadow-sm'
          ></img>
        </div>
        <div className='hidden md:grid grid-rows-2 gap-4'>
          <img
            src='/placeholder-food-1.jpg'
            alt='side-1'
            className='w-full h-167px object-cover rounded-2xl'
          ></img>
          <img
            src='/placeholder-food-2.jpg'
            alt='side-2'
            className='w-full h-167px object-cover rounded-2xl'
          ></img>
        </div>
      </div>
      <div className='mb-8'>
        <h1 className='text-3xl font-extrabold text-slate-900'>
          {resto?.name}
        </h1>
        <div className=' flex items-center space-x-4 mt-2 text-sm text-slate-600'>
          <span className='text-amber-500 font-bold'>
            ★ {resto?.rating} ({resto?.totalReviews || 0} Ulasan)
          </span>
          <span>•</span>
          <span>{resto?.distance || '0 km'}</span>
        </div>

        <hr className='border-slate-200 mb-8'></hr>

        <h2 className='text-2xl font-bold text-slate-800 mb-4'>Menu</h2>
        <Tabs
          defaultValue='all'
          onValueChange={(value) => setActiveCategory(value)}
          className='w-full'
        >
          <TabsList className='mb-6 bg-slate-200/60 p-1 rounded-full w-fit'>
            <TabsTrigger
              value='all'
              className='rounded-full px-6 data-[state=active]:bg-amber-500 data-[state=active]:text-white'
            >
              All Menu
            </TabsTrigger>
            <TabsTrigger
              value='food'
              className='rounded-full px-6 data-[state=active]:bg-amber-500 data-[state=active]:text-white'
            >
              Food
            </TabsTrigger>
            <TabsTrigger
              value='drink'
              className='rounded-full px-6 data-[state=active]:bg-amber-500 data-[state=active]:text-white'
            >
              Drink
            </TabsTrigger>
          </TabsList>

          <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {filteredMenus?.map((item) => {
              const cartItem = cartItems.find((i) => i.menuItem.id === item.id);
              return (
                <div
                  key={item.id}
                  className='bg-white border border-slate-100 rounded-2xl overlow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between'
                >
                  <div className='relative aspect-square w-full bg-slate-100'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='object-cover w-full h-full'
                    ></img>
                  </div>
                  <div className='p-4 flex flex-col grow'>
                    <h3 className='font-bold text-slate-800 text-base line-clamp-1'>
                      {item.name}
                    </h3>
                    <p className='text-amber-600 font-extrabold mt-1 text-sm'>
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                    <div className='mt-4 pt-2'>
                      {!cartItem ? (
                        <Button
                          onClick={() => addToCart(item)}
                          className='w-full bg-red-500 hover:bg-red-600 text-white rounded-full font-semibold text-xs h-9 shadow-sm'
                        >
                          Add
                        </Button>
                      ) : (
                        <div className='flex items-center justify-between border border-red-200 bg-red-50/50 rounded-full p-1 h-9'>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, cartItem.quantity - 1)
                            }
                            className='w-7 h-7 flex items-center justify-center rounded-full bg-white border border-red-200 text-red-500 font-bold hover:bg-red-100 transition text-sm'
                          >
                            -
                          </button>
                          <span className='text-sm font-bold text-slate-800'>
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, cartItem.quantity + 1)
                            }
                            className='w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition text-sm'
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Tabs>
      </div>
    </main>
  );
}
