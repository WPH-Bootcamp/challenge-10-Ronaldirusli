'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/useToast';

//validasi schema dengan zod
const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);
  //setup react hook form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  //fungsi trigger submit login
  const handleLogin = async (data: LoginInput) => {
    try {
      const res = await authApi.login(data);
      //simpan ke local storage n update state zustand global
      setAuth({ ...res.user, id: String(res.user.id) }, res.token);

      toast({
        title: 'Login Berhasil',
        description: `Selamat datang kembali, ${res.user.name}!`,
      });

      //redirect user ke halaman utama resto
      router.push('/menu');
      router.refresh();
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      console.error('Login gagal', error);
      toast({
        variant: 'destructive',
        title: 'Login Gagal',
        description:
          apiError.response?.data?.message || 'Email atau password salah',
      });
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4'>
      <div className='w-full max-w-md space-y-6 rounded-2xl bg-white border p-8 shadow-sm'>
        <div className='space-y-2 text-center'>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
            Foody
          </h1>
          <p className='text-sm text-slate-500'>
            Masuk untuk mulai memesan makanan favoritmu
          </p>
        </div>
        <form onSubmit={handleSubmit(handleLogin)} className='space-y-4'>
          <div className='space-y-1'>
            <label className='text-sm font-medium text-slate-700'>Email</label>
            <Input
              type='email'
              placeholder='nama@email.com'
              {...register('email')}
              className={errors.email ? 'border-red-500' : ''}
            ></Input>
            {errors.email && (
              <p className='text-xs font-medium text-slate-700'>
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
            ></Input>
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
            {isSubmitting ? 'Memproses...' : 'Masuk'}
          </Button>
        </form>
      </div>
    </div>
  );
}
