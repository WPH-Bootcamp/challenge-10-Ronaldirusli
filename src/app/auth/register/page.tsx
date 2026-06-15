'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const handleRegister = async (data: RegisterInput) => {
    try {
      const payload = { ...data, phone: '' };
      await authApi.register(payload);

      toast({
        title: 'Pendaftaran Berhasil',
        description:
          'Akun Anda telah dibuat. Silahkan masuk menggunakan akun baru',
      });

      router.push('/login');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Terjadi kesalahan saat mendaftar.';
      const apiErrorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response
              ?.data?.message
          : undefined;

      toast({
        variant: 'destructive',
        title: 'Pendaftaran Gagal',
        description:
          apiErrorMessage ||
          errorMessage ||
          'Terjadi kesalahan saat mendaftar.',
      });
    }
  };
  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4'>
      <div className='w-full max-w-md space-y-6 rounded-2xl border bg-white p-8 shadow-sm'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
            Foody
          </h1>
          <p className='text-sm text-slate-500'>
            Buat akun barumu untuk menjelajahi rasa kuliner terbaik
          </p>
        </div>
        <form onSubmit={handleSubmit(handleRegister)} className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-slate-700'>
              Nama Lengkap
            </label>
            <Input
              type='text'
              placeholder='John Doe'
              {...register('name')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className='text-xs font-medium text-red-500'>
                {errors.name.message}
              </p>
            )}
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-slate-700'>Email</label>
            <Input
              type='email'
              placeholder='nama@email.com'
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className='text-xs font-medium text-red-500'>
                {errors.email.message}
              </p>
            )}
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-slate-700'>
              Password
            </label>
            <Input
              type='password'
              placeholder='........'
              {...register('password')}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className='text-xs font-medium text-red-500'>
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg mt-2'
          >
            Submit
          </Button>

          <p className='text-center text-sm text-slate-500 mt-4'>
            Sudah punya akun?{' '}
            <Link
              href='/auth/login'
              className='font-semibold text-amber-500 hover:underline'
            >
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
