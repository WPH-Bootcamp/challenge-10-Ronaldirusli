'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '@/store/useCartStore';
import { orderApi, OrderPayload } from '@/lib/api/order';
import { checkoutSchema, checkoutInput } from '@/lib/validations/checkout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Card from '@/components/ui/card';
import { useToast } from '@hooks/use-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {cartItems, getTotalPrice, clearCart} = useCartStore();

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 15000 : 0;
  const totalCost = subtotal + deliveryFee;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<checkoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'cash',
    }
  });

  const orderMutation = useMutation({
    mutationFn: orderApi.createOrder,
    onSuccess: () => {
      toast({
        title: 'Pesanan Berhasil!',
        description: 'Makananmu sedang diproses oleh restoran.',
      });
      clearCart();
      router.push('/history');
    },
    onError: (error: unknown) => {
      const parsedError = error as { response?: { data?: { message?: string } } };
      toast({
        variant: 'destructive',
        title: 'Gagal Membuat Pesanan',
        description: parsedError.response?.data?.message || 'Terjadi kesalahan pada sistem server.',
      });
    },
  });

  const onSubmit = (data: checkoutInput) => {
    const apiItems = cartItems.map((item) => ({
      menuItemId: item.menuItem.id,
      quantity: item.quantity,
    }));

    const payload: OrderPayload = {
      customerName: data.customerName,
      phoneNumber: data.phoneNumber,
      deliveryAddress: data.deliverAddress,
      paymentMethod: data.paymentMethod,
      items: apiItems,
      totalPrice: totalCost,
    };

    orderMutation.mutate(payload);
  };
  if(cartItems.length === 0) {
    return (
      <div className='p-10 text-center text-slate-500'>
        Tidak ada item untuk di checkout. Silahkan pilih menu terlebih dahulu.
      </div>
    );
  }

  return (
    <main className='container mx-auto px-4 py-8 max-w-4xl min-h-screen bg-slate-50'>
      <h1 className='text-2xl font-extrabold text-slate-900 mb-6'>Form Alamat & Pengantaran</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-2 space-y-4'>
          <Card className='p-6 border-slate-100 shadow-sm bg-white rounded-2xl space-y-4'>
            <div className='space-y-1'>
              <label className='text-sm font-semibold text-slate-700'>Nama Penerima</label>
              <Input
                placeholder='Masukkan Nama Lengkap'
                {...register('customerName')}
                className={errors.customerName ? 'border-red-500' : ''}
              />
              {errors.customerName && (
                <p className='text-xs text-red-500 font-medium'>{errors.customerName.message}</p>
              )}
            </div>

            <div className='space-y-1'>
              <label className='text-sm font-semibold text-slate-700'>Alamat Lengkap Pengantaran</label>
              <textarea
                placeholder='Tuliskan nama jalan, nomor rumah, RT/RW, nomor kamar/apartemen...'
                {...register('deliverAddress')}
                rows={4}
                className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${errors.deliverAddress ? 'border-red-500 focus-visible:ring-red-500' : 'border-input focus-visible:ring-slate-400'}`}
              />
              {errors.deliverAddress && (
                <p className='text-xs text-red-500 font-medium'>{errors.deliverAddress.message}</p>
              )}
            </div>

            <div className='space-y-2 pt-2'>
              <label className='text-sm font-semibold text-slate-700'>Metode Pembayaran</label>
              <div className='grid grid-cols-3 gap-3'>
                {['cash', 'e-wallet', 'credit-card'].map((method) => (
                  <label
                    key={method}
                    className='flex flex-col items-center justify-center p-3 border rounded-xl bg-slate-50 cursor-pointer hover: bg-slate-100 transition text-xs font-bold uppercase text-slate-600'>
                    <input
                      type='radio'
                      value={method}
                      {...register('paymentMethod')}
                      className='mb-2 accent-amber-500'>
                    </input>
                    {method.replace('-', '')}
                  </label>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className='text-xs text-red-500 font-medium'>{errors.paymentMethod.message}</p>
              )}
            </div>
          </Card>
        </div>

        <div className='md:col-span-1'>
          <Card classname='p-5 border-slate-100 shadow-sm bg-white rounded-2xl sticky top-24'>
            <h2 className='font-bold text-slate-800 text-base mb-4'>Detail Item</h2>

            <div className='max-h-40 overflow-y-auto space-y-3 mb-4 border-b pb-4 pr-1'>
              {cartItems.map((item) => (
                <div key={item.menuItem.id} className='flex justify-between items-center text-xs text-slate-600'>
                  <div className='line-clamp-1 max-w-150px'>
                    {item.menuItem.name} <span className='text-slate-400 font-bold'>x{item.quantity}</span>
                  </div>
                  <span className='font-semibold text-slate-800'>
                    Rp {(item.menuItem.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
            <div className='space-y-2 text-xs border-b pb-4 text-slate-500'>
              <div className='flex justify between'>
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className='flex justify between'>
                <span>Biaya Pengantaran</span>
                <span>Rp {deliveryFee.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className='flex justify-between items-center pt-4 mb-6'>
              <span className='font-bold text-sm text-slate-800'>Total Tagihan</span>
              <span className='font-extrabold text-amber-600 text-base'>Rp {totalCost.toLocaleString('id-ID')}</span>
            </div>
            <Button
              type='submit'
              disabled={orderMutation.isPending}
              className='w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full py-5 shadow-sm'>
                {orderMutation.isPending ? 'Memproses Pesanan...' : 'Buat Pesanan Sekarang'}
            </Button>
          </Card>
        </div>
      </form>
    </main>
  );
}