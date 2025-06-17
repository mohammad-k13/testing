// utils/server-actions/signup.action.ts (or actions/auth.ts)
'use server';

import { z } from 'zod';
import { ServerActionResult } from '@/types/utils/server-action';
import { CreateUserModel } from '@/app/api/user/route';
import signupSchema from '../form-schema/signup-schema';

export default async function SignupAction(formData: z.infer<typeof signupSchema>): Promise<ServerActionResult<any>> {
      const result = signupSchema.safeParse(formData);

      if (!result.success) {
            return {
                  success: false,
                  payload: result.error.flatten(),
                  message: 'Validation failed.',
            };
      }
      const { username, email, password } = result.data;
      try {
            const body: CreateUserModel = {
                  email,
                  password,
                  role: 'user',
                  username,
            };

            const res = await fetch(`${process.env.CURRECT_DOMAIN}/api/user`, {
                  body: JSON.stringify(body),
                  method: 'POST',
                  headers: {
                        'Content-type': 'application/json',
                  },
            });
            const data = await res.json();

            return { success: res.ok, message: data.message, payload: res.ok ? { url: '/dashboard' } : undefined };
      } catch (err) {
            return {
                  success: false,
                  message: 'Faild to Fetch',
            };
      }
}
