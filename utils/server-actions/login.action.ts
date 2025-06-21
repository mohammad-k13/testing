'use server';

import { ServerActionResult } from '@/types/utils/server-action';
import { z } from 'zod';
import loginSchema from '../form-schema/login-schema';
import { LoginBody } from '@/app/api/auth/login/route';

export default async function loginAction(formData: z.infer<typeof loginSchema>): Promise<ServerActionResult<any>> {
      const result = loginSchema.safeParse(formData);

      if (!result.success) {
            return {
                  success: false,
                  message: 'Validation failed.',
                  payload: result.error.flatten(),
            };
      }

      const { email, password } = result.data;
      console.log(email);
      console.log(password);

      try {
            const body: LoginBody = {
                  email,
                  password,
            };

            const res = await fetch(`${process.env.CURRECT_DOMAIN}/api/auth/login`, {
                  method: 'POST',
                  headers: {
                        'Content-type': 'application/json',
                  },
                  body: JSON.stringify({
                        email,
                        password,
                  }),
            });
            console.log(res)

            const data = await res.json();
            const { message } = data;

            const payload = res.ok ? { url: '/dashboard' } : null;
            return { success: res.ok, message, payload };
      } catch (err) {
            console.log('LoginAction - err', err);

            return {
                  success: false,
                  message: 'Faild to fetch',
                  payload: null,
            };
      }
}
