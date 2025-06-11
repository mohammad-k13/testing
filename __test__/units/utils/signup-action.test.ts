import { signupSchema } from '@/components/form/signup-form';
import SignupAction from '@/utils/server-actions/signup.action';
import { AuthError, AuthResponse, SignUpWithPasswordCredentials } from '@supabase/supabase-js';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest';

const mocks = vi.hoisted(() => {
      const mockSignUp = vi.fn(
            async (data: SignUpWithPasswordCredentials): Promise<AuthResponse> => ({
                  data: {
                        user: null,
                        session: null,
                  },
                  error: null,
            }),
      );

      const mockInsert = vi.fn(({ id, username }: { id: string; username: string }) => ({
            data: [],
            error: null,
      }));

      return {
            mockSignUp,
            mockInsert,
      };
});

vi.mock('@/utils/supabase/client', () => {
      return {
            createClient: vi.fn(() => ({
                  auth: {
                        signUp: mocks.mockSignUp,
                  },
                  from: vi.fn((tableName: string) => ({
                        insert: mocks.mockInsert,
                  })),
            })),
      };
});

describe('SignupAction', () => {
      beforeEach(() => {
            mocks.mockSignUp.mockClear();
            mocks.mockInsert.mockClear();

            mocks.mockSignUp.mockImplementation(
                  async (data: SignUpWithPasswordCredentials): Promise<AuthResponse> => ({
                        data: {
                              user: null,
                              session: null,
                        },
                        error: null,
                  }),
            );
            mocks.mockInsert.mockImplementation(({ id, username }: { id: string; username: string }) => ({
                  data: [],
                  error: null,
            }));
      });

      afterEach(() => {
            cleanup();
            vi.restoreAllMocks();
      });

      const inValidData = {
            username: '24', // username min is 3
            email: 'test@gmail.com',
            password: '234123412341234',
      };

      it('Should reject user creation when fields are not valid', async () => {
            const { success, message, errors } = await SignupAction(inValidData);

            const validation = signupSchema.safeParse(inValidData);

            expect(success).toBe(false);
            expect(message).toBe('Validation failed.');
            expect(errors).toHaveProperty('username');
            expect((errors as { username: string[] }).username[0]).toBe(
                  validation.error?.format().username?._errors[0],
            );
            expect(mocks.mockSignUp).not.toHaveBeenCalled();
            expect(mocks.mockInsert).not.toHaveBeenCalled();
      });

      it('Should return currect error message when supabase authenticate goes wrong', async () => {
            mocks.mockSignUp.mockImplementationOnce(
                  async (data: SignUpWithPasswordCredentials): Promise<AuthResponse> => ({
                        data: { user: null, session: null },
                        error: {
                              name: 'AuthApiError',
                              message: 'You must provide either an email or phone number and a password',
                              status: 400,
                        } as AuthError,
                  }),
            );

            const { success, message, errors } = await SignupAction({
                  username: 'validuser',
                  email: 'existing@example.com',
                  password: 'validpassword123',
            });

            expect(success).toBe(false);
            expect(message).toBe('Failed to sign up. Please try a different email.');
            expect(errors).toHaveProperty('credentials');
            expect((errors as { credentials: string[] }).credentials[0]).toBe(
                  'You must provide either an email or phone number and a password',
            );
            expect(mocks.mockSignUp).toHaveBeenCalledTimes(1);
            expect(mocks.mockInsert).not.toHaveBeenCalled();
      });
});
