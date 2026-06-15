'use client';

import { useCartStore } from '@/store/useCartStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } =
    useCartStore();

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 15000 : 0;
  const totalCost = subtotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <main className='container mx-auto px-4 py-16 text-center max-w-md'>
        <div className='text-6xl mb-4'>🛒</div>
        <h2 className='text-2xl font-bold text-slate-800'>
          Keranjangmu Kosong
        </h2>
        <p className='text-slate-500 mt-2 mb-6 text-sm'>
          Kamu belum menambahkan makanan lezat apapun ke dalam keranjang
          belanjamu.
        </p>
        <Button
          asChild
          className='bg-amber-500 hover:bg-amber-600 rounded-full px-6'
        >
          <Link href='/'>Cari Restoran</Link>
        </Button>
      </main>
    );
  }
  return (
    <main className='container mx-auto px-4 py-8 max-w-4xl min-h-screen'>
      <h1 className='text-2xl font-extrabold text-slate-900 mb-6'>
        Keranjang Belanja
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-4'>
          {cartItems.map((item) => (
            <Card
              key={item.menuItem.id}
              className='p-4 flex items-center space-x-4 border border-slate-100 shadow-sm'
            >
              <img
                src={item.menuItem.image}
                alt={item.menuItem.name}
                className='w-20 h-20 object-cover rounded-xl bg-slate-100'
              ></img>
              <div className='grow'>
                <h3 className='font-bold text-slate-800 text-sm md:text-base line-clamp-1'>
                  {item.menuItem.name}
                </h3>
                <p className='text-amber-600 font-extrabold text-sm mt-1'>
                  Rp {item.menuItem.price.toLocaleString('id-ID')}
                </p>
              </div>
              <div className='flex items-center space-x-3'>
                <div className='flex items-center border border-slate-200 rounded-full p-1 bg-slate-50/50'>
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItem.id, item.quantity - 1)
                    }
                    className='w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-xs'
                  >
                    -
                  </button>
                  <span className='text-xs font-bold px-3 text-slate-800'>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.menuItem.id, item.quantity + 1)
                    }
                    className='w--6 h-6 flex items-center justify rounded-full bg-amber-500 text-white font-bold text-xs'
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.menuItem.id)}
                  className='text-slate-400 hover:text-red-500 transition text-sm font-medium px-1'
                >
                  Hapus
                </button>
              </div>
            </Card>
          ))}
        </div>
        <div className='md:col-span-1'>
          <Card className='p-5 border border-slate-100 shadow-sm sticky top-24 bg-white rounded-2xl'>
            <h2 className='font-bold text-slate-800 text-lg mb-4'>
              Ringkasan Pesanan
            </h2>
            <div className='space-y-3 text-sm border-b pb-4 text-slate-600'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span className='font-semibold text-slate-800'>
                  Rp {subtotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className='flex justify-between'>
                <span>Biaya Pengantaran</span>
                <span className='font-semibold text-slate-800'>
                  Rp {deliveryFee.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
            <div className='flex justify-between items-center px-4 mb-6'>
              <span className='font-bold text-slate-800'>Total Harga</span>
              <span className='font-extrabold text-amber-600 text-lg'>
                Rp {totalCost.toLocaleString('id-ID')}
              </span>
            </div>
            <Button
              onClick={() => router.push('/checkout')}
              className='w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-full py-5 shadow-sm'
            >
              Lanjut ke Checkout
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
