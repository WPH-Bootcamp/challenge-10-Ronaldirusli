'use client';

import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/lib/api/order';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders-history'],
    queryFn: orderApi.getOrder,
  });

  if (isLoading) {
    return (
      <div className='p-10 text-center text-slate-500'>
        Memuat riwayat pesananmu...
      </div>
    );
  }
  if (error) {
    return (
      <div className='p-10 text-center text-slate-500'>
        Gagal memuat data dari server. Pastikan Anda sudah login.
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <main className='container mx-auto px-4 py-16 text-center max-w-md'>
        <div className='text-6xl mb-4'>📋</div>
        <h2 className='text-2xl font-bold text-slate-800'>Belum ada Pesanan</h2>
        <p className='text-slate-500 mt-2 mb-6 text-sm'>
          Kamu belum pernah memesan makanan apapun di Foody. Yuk , cari hidangan
          favoritmu sekarang!
        </p>
        <Button
          asChild
          className='bg-amber-500 hover:bg-amber-600 rounded-full px-6'
        >
          <Link href='/'>Pesan Sekarang</Link>
        </Button>
      </main>
    );
  }
  return (
    <main className='container mx-auto px-4 py-8 max-w-3xl min-h-screen bg-slate-50'>
      <h1 className='text-2xl font-extrabold text-slate-900 mb-6'>
        Riwayat Pesanan Anda
      </h1>
      <div className='space-y-4'>
        {orders.map((order) => {
          const getStatusStyles = (status: string) => {
            switch (status) {
              case 'Success':
                return 'bg-green-50 text-green-700 border-green-200';
              case 'Pending':
                return 'bg-amber-50 text-amber-700 border-amber-200';
              default:
                return 'bg-red-50 text-red-700 border-red-200';
            }
          };
          return (
            <Card
              key={order.id}
              className='p-5 border-slate-100 shadow-sm bg-white rounded-2xl'
            >
              <div className='flex justify-between items-center border-b pb-3 mb-4'>
                <div>
                  <p className='text-xs text-slate-400 font-medium'>
                    ID Pesanan: {order.id}
                  </p>
                  <p className='text-sm font-semibold text-slate-700 mt-0,5'>
                    {new Date(order.createAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`text-xs py-3 py-1 rounded-full border font-bold ${getStatusStyles(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className='space-y-3'>
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center space-x-3 text-sm'
                  >
                    <img
                      src={item.menuItem.image || '/placeholder-food-1.jpg'}
                      alt={item.menuItem.name}
                      className='w-12 h-12 object-cover rounded -lg bg-slate-100 flex-shrink-0'
                    />
                    <div className='grow'>
                      <h4 className='font-bold text-slate-800 line-clamp-1'>
                        {item.menuItem.name}
                      </h4>
                      <p className='text-xs text-slate-400 mt-0.5'>
                        {item.quantity} x Rp{' '}
                        {item.menuItem.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex justify-between items-center pt-4 mt-4 border-t border-dashed'>
                <span className='text-xs font-semibold text-slate-500'>
                  Total Transaksi
                </span>
                <span className='font-extrabold text-amber-600 text-base'>
                  Rp {order.totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
