import { LoginForm, loginSchema } from '@/components/form/login-form';
import * as LoginAction from '@/utils/server-actions/login.action';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/server-actions/login.action', () => ({
      default: vi.fn(),
}));

describe('LoginForm', () => {
      //general configs
      const setup = () => {
            const container = render(<LoginForm />);
            const user = userEvent.setup();

            const emailInput = container.getByLabelText(/email/i) as HTMLInputElement;
            const passInput = container.getByLabelText(/password/i) as HTMLInputElement;
            const loginButton = container.getByRole('button', { name: /^login$/i });
            const githubLogin = container.getByRole('button', { name: /^login with github$/i });

            return {
                  container,
                  user,
                  containerEls: {
                        emailInput,
                        passInput,
                        loginButton,
                        githubLogin,
                  },
            };
      };

      const testValues = {
            email: 'email-test',
            password: 'pass',
      };

      afterEach(() => {
            cleanup();
      });

      it('Should Render email, password and login with github elements', () => {
            const {
                  containerEls: { emailInput, githubLogin, loginButton, passInput },
            } = setup();

            expect(emailInput).toBeInTheDocument();
            expect(passInput).toBeInTheDocument();
            expect(loginButton).toBeInTheDocument();
            expect(githubLogin).toBeInTheDocument();
      });

      it('User Should be able to fill out forms', async () => {
            const {
                  user,
                  containerEls: { emailInput, passInput },
            } = setup();

            await user.type(emailInput, testValues.email);
            await user.type(passInput, testValues.password);

            expect(emailInput.value).toBe(testValues.email);
            expect(passInput.value).toBe(testValues.password);
      });

      it('User should not able to submit form when form is inValid', async () => {
            const {
                  user,
                  containerEls: { emailInput, passInput, loginButton },
            } = setup();

            await user.type(emailInput, testValues.email);
            await user.type(passInput, testValues.password);
            await user.click(loginButton);

            expect(LoginAction.default).not.toHaveBeenCalled();
      });

      it('User should able to submit form when form is isValid', async () => {
            const {
                  user,
                  containerEls: { emailInput, passInput, loginButton },
            } = setup();

            await user.type(emailInput, 'test@gamil.com');
            await user.type(passInput, 'Mohammad@@1383');
            await user.click(loginButton);

            expect(LoginAction.default).toHaveBeenCalledOnce();
            expect(LoginAction.default).toHaveBeenCalledWith({ email: 'test@gamil.com', password: 'Mohammad@@1383' });
      });

      describe('LoginSchema', () => {
            const formattedError = (data: { email?: string; password?: string }) => {
                  const validation = loginSchema.safeParse(data);
                  let errors = { email: { _errors: [] }, password: { _errors: [] } };

                  if (!validation.success) {
                        errors = errors;
                  }

                  return { success: validation.success, errors };
            };

            describe('Email Validation', () => {
                  it('Should Reject invalid email with currect error message and password be required', () => {
                        const { errors, success } = formattedError({ email: 'test@234' });
                        expect(success).toBe(false);

                        if (!success) {
                              const error_email = errors.email?._errors[0];
                              const error_pass = errors.password?._errors[0];
                              expect(error_email).toContain('Invalid email address');
                              expect(error_pass).toContain('Required');
                        }
                  });

                  it('Should accept valid email', () => {
                        const { success } = formattedError({ email: 'test@example.com', password: 'Mohammad' });
                        expect(success).toBe(true);
                  });
            });

            describe('Password Validation', () => {
                  it('Should reject short password with currect error message', () => {
                        const { success, errors } = formattedError({ email: 'test@example.com', password: '1234' });
                        expect(success).toBe(false);

                        if (!success) {
                              const error_pass = errors.password?._errors[0];
                              expect(error_pass).toContain('Password must be at least 6 characters');
                        }
                  });

                  it('Should access +6 character password', () => {
                        const { success } = formattedError({ email: 'test@example.com', password: 'Mohammad' });
                        expect(success).toBe(true);
                  });
            });
      });
});
