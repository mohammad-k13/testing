// import { signupSchema } from '@/components/form/signup-form';
// import SignupAction from '@/utils/server-actions/signup.action';
// import { AuthError, AuthResponse, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
// import { cleanup } from '@testing-library/react';
// import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

// const mocks = vi.hoisted(() => {
//       const mockSignUp = vi.fn(
//             async (data: SignUpWithPasswordCredentials): Promise<AuthResponse> => ({
//                   data: {
//                         user: null,
//                         session: null,
//                   },
//                   error: null,
//             }),
//       );

//       const mockInsert = vi.fn(({ id, username }: { id: string; username: string }) => ({
//             data: [],
//             error: null,
//       }));

//       return {
//             mockSignUp,
//             mockInsert,
//       };
// });

// vi.mock('@/utils/supabase/client', () => {
//       return {
//             createClient: vi.fn(() => ({
//                   auth: {
//                         signUp: mocks.mockSignUp,
//                   },
//                   from: vi.fn((tableName: string) => ({
//                         insert: mocks.mockInsert,
//                   })),
//             })),
//       };
// });

// describe('SignupAction', () => {
//       beforeEach(() => {
//             mocks.mockSignUp.mockClear();
//             mocks.mockInsert.mockClear();

//             mocks.mockSignUp.mockImplementation(
//                   async (data: SignUpWithPasswordCredentials): Promise<AuthResponse> => ({
//                         data: {
//                               user: null,
//                               session: null,
//                         },
//                         error: null,
//                   }),
//             );
//             mocks.mockInsert.mockImplementation(({ id, username }: { id: string; username: string }) => ({
//                   data: [],
//                   error: null,
//             }));
//       });

//       afterEach(() => {
//             cleanup();
//             vi.restoreAllMocks();
//       });

//       const inValidData = {
//             username: '24', // username min is 3
//             email: 'test@gmail.com',
//             password: '234123412341234',
//       };

//       it('Should reject user creation when fields are not valid', async () => {
//             const { success, message, errors } = await SignupAction(inValidData);

//             const validation = signupSchema.safeParse(inValidData);

//             expect(success).toBe(false);
//             expect(message).toBe('Validation failed.');
//             expect(errors).toHaveProperty('username');
//             expect((errors as { username: string[] }).username[0]).toBe(
//                   validation.error?.format().username?._errors[0],
//             );
//             expect(mocks.mockSignUp).not.toHaveBeenCalled();
//             expect(mocks.mockInsert).not.toHaveBeenCalled();
//       });

//       it('Should return currect error message when supabase authenticate goes wrong', async () => {
//             mocks.mockSignUp.mockImplementationOnce(
//                   async (data: SignUpWithPasswordCredentials): Promise<AuthResponse> => ({
//                         data: { user: null, session: null },
//                         error: {
//                               name: 'AuthApiError',
//                               message: 'You must provide either an email or phone number and a password',
//                               status: 400,
//                         } as AuthError,
//                   }),
//             );

//             const { success, message, errors } = await SignupAction({
//                   username: 'validuser',
//                   email: 'existing@example.com',
//                   password: 'validpassword123',
//             });

//             expect(success).toBe(false);
//             expect(message).toBe('Failed to sign up. Please try a different email.');
//             expect(errors).toHaveProperty('credentials');
//             expect((errors as { credentials: string[] }).credentials[0]).toBe(
//                   'You must provide either an email or phone number and a password',
//             );
//             expect(mocks.mockSignUp).toHaveBeenCalledTimes(1);
//             expect(mocks.mockInsert).not.toHaveBeenCalled();
//       });
// });

import { redirect } from 'next/dist/server/api-utils';
import { afterEach, beforeEach, describe, expect, vi } from 'vitest';
import { z } from 'zod';
import signupSchema from '@/utils/form-schema/signup-schema';
import { it } from 'vitest';
import SignupAction from '@/utils/server-actions/signup.action';

describe('SingupAction', () => {
      const validFormData: z.infer<typeof signupSchema> = {
            email: 'test@gmail.com',
            password: '123412341234',
            username: 'mohammd234',
      };

      let fetchSpy: ReturnType<typeof vi.spyOn>;

      beforeEach(() => {
            vi.clearAllMocks();

            process.env.CURRECT_DOMAIN = 'http://localhost:3000';

            fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(async (input, init) => {
                  return new Response(JSON.stringify({ message: 'User created successfully' }), { status: 200 });
            });
      });

      afterEach(() => {
            vi.restoreAllMocks();
            delete process.env.CURRECT_DOMAIN;
      });

      it('Should return success and call fetch with currect data on valid input', async () => {
            const result = await SignupAction(validFormData);

            expect(result.success).toBe(true);
            expect(result.message).toBe('User created successfully');
            expect(result.payload).toEqual({ url: '/dashboard' });
      });

      it('should return failure and validation errors on invalid input', async () => {
            const invalidFormData = {
                  username: 'ab',
                  email: 'invalid-email',
                  password: '123',
            };

            const result = await SignupAction(invalidFormData as any);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Validation failed.');
            expect(result.payload).toBeDefined();

            expect(result.payload.fieldErrors.username).toContain('Username must be at least 3 characters');
            expect(result.payload.fieldErrors.email).toContain('Invalid email address');
            expect(result.payload.fieldErrors.password).toContain('Password must be at least 6 characters');

            expect(fetchSpy).not.toHaveBeenCalled();
      });

      it('should return failure if API call responds with a non-OK status', async () => {
            fetchSpy.mockImplementationOnce(async () => {
                  return new Response(JSON.stringify({ message: 'Email already exists' }), {
                        status: 409,
                        headers: { 'Content-Type': 'application/json' },
                  });
            });

            const result = await SignupAction(validFormData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Email already exists');
            expect(result.payload).toBeUndefined();

            expect(fetchSpy).toHaveBeenCalledTimes(1);
      });

      it('should return failure if a network error occurs during the API call', async () => {
            fetchSpy.mockImplementationOnce(async () => {
                  throw new TypeError('Failed to fetch: Network Error');
            });

            const result = await SignupAction(validFormData);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Faild to Fetch');
            expect(result.payload).toBeUndefined();

            expect(fetchSpy).toHaveBeenCalledTimes(1);
      });
});
