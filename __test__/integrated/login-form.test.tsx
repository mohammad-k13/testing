import { LoginForm } from '@/components/form/login-form';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocked = vi.hoisted(() => {
      const toastFn = vi.fn((message: string) => {});
      const mockedToast = {
            error: toastFn,
            success: toastFn,
      };

      const mockedFetch = vi.fn();

      return {
            mockedToast,
            mockedFetch,
      };
});

vi.mock('sonner', () => ({
      toast: mocked.mockedToast,
}));

vi.mock('next/navigation', () => ({
      useRouter: () => ({
            push: vi.fn(),
      }),
}));

describe('Loginfrom with LoginAction', () => {
      const setup = () => {
            const container = render(<LoginForm />);
            const user = userEvent.setup();

            const emailInput = container.getByLabelText(/email/i) as HTMLInputElement;
            const passInput = container.getByLabelText(/password/i) as HTMLInputElement;
            const loginButton = container.getByRole('button', { name: /^login$/i });
            const githubLogin = container.getByRole('button', { name: /^login with github$/i });
            const signUpLink = container.getByRole('link', { name: /sign up/i });

            return {
                  container,
                  user,
                  containerEls: {
                        emailInput,
                        passInput,
                        loginButton,
                        githubLogin,
                        signUpLink,
                  },
            };
      };

      const validUserData = {
            email: 'mohamamd@gmai.col',
            password: '123412341234',
      };

      beforeEach(() => {
            process.env.CURRECT_DOMAIN = 'http://localhost:3000';

            mocked.mockedFetch.mockClear();
            global.fetch = mocked.mockedFetch;

            mocked.mockedToast.error.mockClear();
            mocked.mockedToast.success.mockClear();
      });

      afterEach(() => {
            process.env.CURRECT_DOMAIN = '';
            // vi.clearAllMocks();
            cleanup();
      });

      it('Should show currect message when users if offline or url was invalid in loginAction', async () => {
            mocked.mockedFetch.mockRejectedValueOnce('');

            const {
                  containerEls: { emailInput, loginButton, passInput },
                  user,
            } = setup();

            await user.type(emailInput, validUserData.email);
            await user.type(passInput, validUserData.password);
            await user.click(loginButton);

            expect(mocked.mockedFetch).toHaveBeenCalled();
            expect(mocked.mockedToast.error).toHaveBeenCalled();
            expect(mocked.mockedToast.error).toHaveBeenCalledWith('Faild to fetch');
      });

      it('Should show exact message that came from fetch', async () => {
            mocked.mockedFetch.mockImplementation(() => {
                  return new Response(JSON.stringify({ message: 'User not found!' }), { status: 200 });
            });

            const {
                  containerEls: { emailInput, loginButton, passInput },
                  user,
            } = setup();

            await user.type(emailInput, validUserData.email);
            await user.type(passInput, validUserData.password);
            await user.click(loginButton);

            expect(mocked.mockedToast.error).toHaveBeenCalled();
            expect(mocked.mockedToast.error).toHaveBeenCalledWith('User not found!');
      });
});
