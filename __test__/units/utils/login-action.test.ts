// top of file
import loginAction from '@/utils/server-actions/login.action';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

declare global {
      var __mocks: {
            mockedRedirect?: Mock;
            mockedSetCookie?: Mock;
      };
}

vi.mock('next/navigation', () => {
      const mockedRedirect = vi.fn();
      globalThis.__mocks = globalThis.__mocks || {};
      globalThis.__mocks.mockedRedirect = mockedRedirect;
      return {
            redirect: mockedRedirect,
      };
});

vi.mock('next/headers', () => {
      const mockedSetCookie = vi.fn();
      globalThis.__mocks = globalThis.__mocks || {};
      globalThis.__mocks.mockedSetCookie = mockedSetCookie;
      return {
            cookies: () => ({
                  set: mockedSetCookie,
            }),
      };
});
describe('LoginAction', () => {
      beforeEach(() => {
            vi.clearAllMocks();
      });

      it('Should return success false when email or password is not valid', async () => {
            const resultWithIncorrectEmail = await loginAction({ email: 'test', password: '123456' });

            expect(resultWithIncorrectEmail).toEqual({
                  errors: {
                        email: ['Invalid email address'],
                  },
                  success: false,
            });

            const resultWithIncorectPassword = await loginAction({ email: 'test@example.com', password: '234' });

            expect(resultWithIncorectPassword).toEqual({
                  errors: {
                        password: ['Password must be at least 6 characters'],
                  },
                  success: false,
            });
      });

      it('Should return correct error message when user not found', async () => {
            const result = await loginAction({ email: 'test@gmail.com', password: '1234523' });

            expect(result).toEqual({
                  success: false,
                  errors: {
                        credentials: ['Invalid email or password'],
                  },
            });
      });

      it('Should store user info in cookie and redirect user', async () => {
            const result = await loginAction({ email: 'user@gmail.com', password: 'useruser' });

            expect(result).toBe(undefined);

            expect(globalThis.__mocks.mockedRedirect).toHaveBeenCalledTimes(1);
            expect(globalThis.__mocks.mockedRedirect).toHaveBeenCalledWith('/dashboard');
            expect(globalThis.__mocks.mockedSetCookie).toHaveBeenCalledWith(
                  'token',
                  JSON.stringify({
                        userID: 1,
                        email: 'user@gmail.com',
                        password: 'useruser',
                        role: 'user',
                  }),
                  {
                        httpOnly: true,
                        secure: true,
                        path: '/',
                        maxAge: 60 * 60 * 24 * 7,
                  },
            );
      });
});
