// utils/server-actions/signup.action.ts (or actions/auth.ts)
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '../supabase/client';
import { z } from 'zod';
import { signupSchema } from '@/components/form/signup-form';

export default async function SignupAction(formData: z.infer<typeof signupSchema>) {
      const result = signupSchema.safeParse(formData);

      if (!result.success) {
            return {
                  success: false,
                  errors: result.error.flatten().fieldErrors,
                  message: 'Validation failed.',
            };
      }
      const { username, email, password } = result.data;

      const supabase = createClient();

      const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                  emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
      });

      if (authError) {
            console.error('Supabase signup error:', authError.message);
            return {
                  success: false,
                  errors: {
                        credentials: [authError.message],
                  },
                  message: 'Failed to sign up. Please try a different email.',
            };
      }

      const userId = authData.user?.id;

      if (!userId) {
            console.error('Signup completed but user ID was null.');
            return {
                  success: false,
                  errors: {
                        server: ['An unexpected error occurred during signup.'],
                  },
                  message: 'Signup failed due to an internal error.',
            };
      }

      const { error: profileError } = await supabase.from('users').insert({
            id: userId, // Link to auth.users.id
            username: username,
      });

      if (profileError) {
            console.error('Error inserting user profile:', profileError.message);
            return {
                  success: false,
                  errors: {
                        database: ['Failed to create user profile. Please try again.'],
                  },
                  message: 'Failed to complete signup process.',
            };
      }

      console.log('User signed up and profile created successfully for ID:', userId);

      redirect('/auth/login');
}
