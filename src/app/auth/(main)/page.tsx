'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/useToast';
import { useAuthStore } from '@/store/useAuthStore';
import {
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Loader,
  Loader2,
} from 'lucide-react';
import { isThrowStatement } from 'typescript';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
}

interface RestaurantData {
  id: string;
  name: string;
  address?: string;
  description?: string;
  menus: MenuItem[];
}

export default function RestoMenuPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const restoId = searchParams.get('restoId');
  const token = useAuthStore((state) => state.token);

  const [resto, setResto] = React.useState<RestaurantData | null>(null);
  const [isLoading, setisLoading] = React.useState<boolean>(() =>
    Boolean(restoId)
  );
  const [cart, setCart] = React.useState<Record<string, number>>({});

  React.useEffect(() => {
    if (!restoId) {
      return;
    }
    const fetchRestoMenu = async () => {
      try {
        setisLoading(true);

        const response = await fetch(
          `https://be-restaurant-production.up.railway.app/api/restaurant/${restoId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token && { Authorization: `Bearer ${token}` }),
            },
          }
        );

        if (!response.ok) {
          throw new Error('Gagal memuat data menu dari restoran ini.');
        }

        const result = await response.json();

        const finalData = result.data ? result.data : result;
        setResto(finalData);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : 'Terjadi kesalahan pada server.';
        toast({
          variant: 'destructive',
          title: 'Gagal Memuat Menu',
          description: message,
        });
      } finally {
        setisLoading(false);
      }
    };
    fetchRestoMenu();
  }, [restoId, toast]);

  const handleUpdateCart = (menuId: string, amount: number) => {
    setCart((prev) => {
      const currentQty = prev[menuId] || 0;
      const newQty = currentQty + amount;
      if (newQty <= 0) {
        const { [menuId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [menuId]: newQty };
    });
  };

  const handleCheckout = () => {
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    if (totalItems === 0) return;

    toast({
      title: 'Sukses',
      description: `Berhasil menambahkan ${totalItems} item ke dalam keranjang belanja.`,
    });
  };

  const formatRupiah = (value: number | string) => {
    const numericValue = Number(value);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(isNaN(numericValue) ? 0 : numericValue);
  };

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-primary'></Loader2>
        <p className='text-sm text-muted-foreground font-mendium'>
          Sedang Memuat Menu Makanan...
        </p>
      </div>
    );
  }

  if (!resto) {
    return (
      <div className='container mx-auto p-8 text-center max-w-md mt-12'>
        <h2 className='text-xl font-bold text-slate-800 mb-2'>
          Restoran Tidak Ditemukan.
        </h2>
        <p className='text-sm text-slate-500 mb-4'>
          Pastikan kamu mengklik restoran yang valid dari halaman utama.
        </p>
        <Button onClick={() => router.back()} className='w-full'>
          Kembali
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 max-w-4xl min-h-screen pb-24'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => router.back()}
          className='rounded-xl'
        >
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            {resto.name}
          </h1>
          <p className='text-xs text-slate-500'>
            {resto.address || resto.description || 'Pilih menu favoritmu'}
          </p>
        </div>
      </div>
      {!resto.menus || resto.menus.length === 0 ? (
        <div className='text-center py-16 border border-dashed rounded-2xl bg-white'>
          <p className='text-slate-400 text-sm'>
            Belum ada menu yang terdaftar di restoran ini.
          </p>
        </div>
      ) : (
        <div className='grid grid=cols-1 md:grid-cols-2 gap-4'>
          {resto.menus.map((item) => (
            <Card
              key={item.id}
              className='flex flex-col overflow-hidden justify-between shadow-sm border-slate-100 rounded-xl bg-white'
            >
              <div className='flex gap-4 p-4'>
                {/* Gambar Item Menu */}
                <div className='w-24 h-24 rounded-lg bg-slate-100 shrink-0 overflow-hidden relative border border-slate-100'>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-slate-200 text-[10px] text-slate-400'>
                      No Image
                    </div>
                  )}
                  {item.category && (
                    <span className='absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded-md font-medium'>
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Deskripsi Menu */}
                <div className='flex-1 space-y-1'>
                  <h3 className='font-semibold text-slate-900 leading-tight'>
                    {item.name}
                  </h3>
                  <p className='text-xs text-slate-400 line-clamp-2'>
                    {item.description || 'Tidak ada deskripsi.'}
                  </p>
                  <p className='text-sm font-bold text-emerald-600 pt-1'>
                    {formatRupiah(item.price)}
                  </p>
                </div>
              </div>

              {/* Tombol Aksi Tambah Kuantitas */}
              <CardFooter className='border-t border-slate-50 bg-slate-50/50 px-4 py-2.5 flex justify-end items-center'>
                {cart[item.id] ? (
                  <div className='flex items-center gap-3'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-7 w-7 rounded-lg'
                      onClick={() => handleUpdateCart(item.id, -1)}
                    >
                      <Minus className='h-3 w-3' />
                    </Button>
                    <span className='text-sm font-semibold w-4 text-center text-slate-800'>
                      {cart[item.id]}
                    </span>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-7 w-7 rounded-lg'
                      onClick={() => handleUpdateCart(item.id, 1)}
                    >
                      <Plus className='h-3 w-3' />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size='sm'
                    variant='outline'
                    className='h-8 px-4 text-xs font-medium text-slate-700 bg-white border-slate-200 hover:bg-slate-50 rounded-lg'
                    onClick={() => handleUpdateCart(item.id, 1)}
                  >
                    Tambah
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Floating Cart Button */}
      {Object.keys(cart).length > 0 && (
        <div className='fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50'>
          <Button
            className='w-full shadow-xl justify-between py-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all'
            onClick={handleCheckout}
          >
            <div className='flex items-center gap-2'>
              <ShoppingCart className='h-5 w-5' />
              <span className='font-bold'>
                {Object.values(cart).reduce((a, b) => a + b, 0)} Porsi Terpilih
              </span>
            </div>
            <span className='text-xs font-bold bg-white/20 px-2 py-1 rounded-lg'>
              Lanjut Pesan →
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
