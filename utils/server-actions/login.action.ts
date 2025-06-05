// utils/server-actions/login.action.ts
'use server';

import { loginSchema } from '@/components/form/login-form';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// Fake user database
const userInfomation = [
      {
            userID: 1,
            email: 'user@gmail.com',
            password: 'useruser',
            role: 'user',
      },
      {
            userID: 2,
            email: 'admin@gmail.com',
            password: 'adminadmin',
            role: 'admin',
      },
];


export default async function loginAction(formData: { email: string; password: string }) {
      const result = loginSchema.safeParse(formData);

      if (!result.success) {
            return {
                  success: false,
                  errors: result.error.flatten().fieldErrors,
            };
      }

      const { email, password } = result.data;

      const user = userInfomation.find((item) => item.email === email && item.password === password);

      if (!user) {
            return {
                  success: false,
                  errors: {
                        credentials: ['Invalid email or password'],
                  },
            };
      }

      // Set a secure cookie
      const cookieStore = await cookies();
      cookieStore.set('token', JSON.stringify(user), {
            httpOnly: true,
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      redirect('/dashboard');
}
