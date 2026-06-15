import { z } from 'zod';

export const checkoutSchema = z.object({
  customerName: z.string().min(3, 'Nama minimal terdiri dari 3 karakter'),
  phoneNumber: z
    .string()
    .min(10, 'Nomot telepon minimal 10 digit')
    .max(13, 'Nomor telepon maksimal 13 digit'),
  deliverAddress: z
    .string()
    .min(10, 'Alamat pengantaran harus detail (minimal 10 karakter)'),
  paymentMethod: z.enum(['cash', 'e-wallet', 'credit-card'], {
    message: 'Silahkan pilih metode pembayaran',
  }),
});

export type checkoutInput = z.infer<typeof checkoutSchema>;
