import loginAction from '@/utils/server-actions/login.action';
import { beforeEach, expect, it, vi } from 'vitest';
import { describe } from 'vitest';

const mocked = vi.hoisted(() => {
      const mockedFetch = vi.fn();

      return { mockedFetch };
});

global.fetch = mocked.mockedFetch;

describe('LoginAction', () => {
      const validUserData = {
            email: 'mohamamd@gmail.com',
            password: 'testtest234',
      };

      const invalidUserData = {
            email: 'mohammad',
            password: 'tst',
      };

      const resultMessage = {
            validationfailed: 'Validation failed.',
            failedToFetch: 'Faild to fetch',
            invalidEmail: 'Invalid email address',
            welcome: 'Welcome Mohammad',
            invalidPassword: 'Password must be at least 6 characters',
            userNotFound: 'User not found!',
            invalidEmailOrPassword: "Email or password isn't valid",
      };

      beforeEach(() => {
            mocked.mockedFetch.mockClear();
      });

      it('Should reject data with currect error message', async () => {
            const { message, success, payload } = await loginAction(invalidUserData);

            expect(success).toBe(false);
            expect(message).toBe(resultMessage.validationfailed);

            // validation tesst
            expect(payload).toHaveProperty('fieldErrors');
            expect(payload.fieldErrors.email[0]).toBe(resultMessage.invalidEmail);
            expect(payload.fieldErrors.password[0]).toBe(resultMessage.invalidPassword);

            // fetch test
            expect(mocked.mockedFetch).not.toHaveBeenCalled();
      });

      it('Should show faild to fetch when request rejected(offline or invalid url)', async () => {
            mocked.mockedFetch.mockRejectedValueOnce('inValid URL');

            const { message, success, payload } = await loginAction(validUserData);

            expect(success).toBe(false);
            expect(message).toBe(resultMessage.failedToFetch);
            expect(payload).toBe(null);
      });

      it('Should show currect message when user do not exist', async () => {
            mocked.mockedFetch.mockImplementationOnce(() => {
                  return new Response(JSON.stringify({ message: resultMessage.userNotFound }), { status: 404 });
            });

            const { message, success, payload } = await loginAction(validUserData);

            expect(success).toBe(false);
            expect(message).toBe(resultMessage.userNotFound);
            expect(payload).toBeFalsy();
      });

      it('Should show currect message when password is wrong', async () => {
            mocked.mockedFetch.mockImplementationOnce(() => {
                  return new Response(JSON.stringify({ message: resultMessage.invalidEmailOrPassword }), {
                        status: 401,
                  });
            });

            const { message, success, payload } = await loginAction(validUserData);

            expect(success).toBe(false);
            expect(message).toBe(resultMessage.invalidEmailOrPassword);
            expect(payload).toBeFalsy();
      });

      it('Should show currect message when password is currect', async () => {
            mocked.mockedFetch.mockImplementationOnce(() => {
                  return new Response(JSON.stringify({ message: resultMessage.welcome }), { status: 200 });
            });

            const { message, success, payload } = await loginAction(validUserData);

            expect(success).toBe(true);
            expect(message).toBe(resultMessage.welcome);
            expect(payload).toHaveProperty('url');
            expect(payload.url).toBe('/dashboard');
      });
});

// // top of file
// import loginAction from '@/utils/server-actions/login.action';
// import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

// declare global {
//       var __mocks: {
//             mockedRedirect?: Mock;
//             mockedSetCookie?: Mock;
//       };
// }

// vi.mock('next/navigation', () => {
//       const mockedRedirect = vi.fn();
//       globalThis.__mocks = globalThis.__mocks || {};
//       globalThis.__mocks.mockedRedirect = mockedRedirect;
//       return {
//             redirect: mockedRedirect,
//       };
// });

// vi.mock('next/headers', () => {
//       const mockedSetCookie = vi.fn();
//       globalThis.__mocks = globalThis.__mocks || {};
//       globalThis.__mocks.mockedSetCookie = mockedSetCookie;
//       return {
//             cookies: () => ({
//                   set: mockedSetCookie,
//             }),
//       };
// });
// describe('LoginAction', () => {
//       beforeEach(() => {
//             vi.clearAllMocks();
//       });

//       it('Should return success false when email or password is not valid', async () => {
//             const resultWithIncorrectEmail = await loginAction({ email: 'test', password: '123456' });

//             expect(resultWithIncorrectEmail).toEqual({
//                   errors: {
//                         email: ['Invalid email address'],
//                   },
//                   success: false,
//             });

//             const resultWithIncorectPassword = await loginAction({ email: 'test@example.com', password: '234' });

//             expect(resultWithIncorectPassword).toEqual({
//                   errors: {
//                         password: ['Password must be at least 6 characters'],
//                   },
//                   success: false,
//             });
//       });

//       it('Should return correct error message when user not found', async () => {
//             const result = await loginAction({ email: 'test@gmail.com', password: '1234523' });

//             expect(result).toEqual({
//                   success: false,
//                   errors: {
//                         credentials: ['Invalid email or password'],
//                   },
//             });
//       });

//       it('Should store user info in cookie and redirect user', async () => {
//             const result = await loginAction({ email: 'user@gmail.com', password: 'useruser' });

//             expect(result).toBe(undefined);

//             expect(globalThis.__mocks.mockedRedirect).toHaveBeenCalledTimes(1);
//             expect(globalThis.__mocks.mockedRedirect).toHaveBeenCalledWith('/dashboard');
//             expect(globalThis.__mocks.mockedSetCookie).toHaveBeenCalledWith(
//                   'token',
//                   JSON.stringify({
//                         userID: 1,
//                         email: 'user@gmail.com',
//                         password: 'useruser',
//                         role: 'user',
//                   }),
//                   {
//                         httpOnly: true,
//                         secure: true,
//                         path: '/',
//                         maxAge: 60 * 60 * 24 * 7,
//                   },
//             );
//       });
// });
