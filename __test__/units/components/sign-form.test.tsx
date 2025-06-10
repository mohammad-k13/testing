import { SignupForm, signupSchema } from '@/components/form/signup-form';
import SignupAction from '@/utils/server-actions/signup.action';
import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
      __esModule: true,
      default: vi.fn(({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>),
}));

vi.mock('@/utils/server-actions/signup.action', () => ({
      default: vi.fn(),
}));

describe('SignUpForm', () => {
      const setup = () => {
            const container = render(<SignupForm />);

            const usernameInput = container.getByLabelText(/username/i) as HTMLInputElement;
            const emailInput = container.getByLabelText(/email/i) as HTMLInputElement;
            const passwordInput = container.getByLabelText(/password/i) as HTMLInputElement;
            const submitButton = container.getByRole('button', { name: /create account/i });
            const loginLink = container.getByRole('link', { name: /login/i });

            const user = userEvent.setup();

            return {
                  container,
                  containerEls: {
                        usernameInput,
                        emailInput,
                        passwordInput,
                        submitButton,
                        loginLink,
                  },
                  user,
            };
      };

      const incurrectFormValues = {
            username: '23',
            email: 'test',
            password: '123',
      };

      const currectFormValues = {
            username: 'mohammad_k13',
            email: 'test@gmai.com',
            password: '123412341234',
      };

      beforeEach(() => {
            vi.clearAllMocks(); // reset mock call times;
      });

      afterEach(() => {
            cleanup();
      });

      it('Should render username, email, password, submit button and login link', () => {
            const {
                  containerEls: { usernameInput, emailInput, passwordInput, submitButton, loginLink },
            } = setup();

            expect(usernameInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(submitButton).toBeInTheDocument();
            expect(loginLink).toBeInTheDocument();
      });

      it('Should has currect path for login link', () => {
            const {
                  containerEls: { loginLink },
            } = setup();

            expect(loginLink).toHaveAttribute('href', '/auth/login');
      });

      it('Should let user fill out the form', async () => {
            const {
                  user,
                  containerEls: { emailInput, passwordInput, usernameInput, submitButton },
            } = setup();

            await user.type(usernameInput, incurrectFormValues.username);
            await user.type(emailInput, incurrectFormValues.email);
            await user.type(passwordInput, incurrectFormValues.password);

            expect(usernameInput.value).toBe(incurrectFormValues.username);
            expect(emailInput.value).toBe(incurrectFormValues.email);
            expect(passwordInput.value).toBe(incurrectFormValues.password);
      });

      it('Should disabled submit button when from is inValid', async () => {
            const {
                  user,
                  containerEls: { emailInput, passwordInput, usernameInput, submitButton },
            } = setup();

            await user.type(usernameInput, incurrectFormValues.username);
            await user.type(emailInput, incurrectFormValues.email);
            await user.type(passwordInput, incurrectFormValues.password);
            await user.click(submitButton);

            expect(SignupAction).not.toHaveBeenCalled();
      });

      it('Should submit formw hen from is valid', async () => {
            const {
                  user,
                  containerEls: { emailInput, passwordInput, usernameInput, submitButton },
            } = setup();

            await user.type(usernameInput, currectFormValues.username);
            await user.type(emailInput, currectFormValues.email);
            await user.type(passwordInput, currectFormValues.password);
            await user.click(submitButton);

            expect(SignupAction).toHaveBeenCalled();
            expect(SignupAction).toHaveBeenCalledWith({
                  username: currectFormValues.username,
                  email: currectFormValues.email,
                  password: currectFormValues.password,
            });
      });

      describe('SignUpSchema', () => {
            const formattedError = (data: { username?: string; email?: string; password?: string }) => {
                  const validation = signupSchema.safeParse(data);
                  let errors: any = { username: { _errors: [] }, email: { _errors: [] }, password: { _errors: [] } };

                  if (!validation.success) {
                        errors = validation.error.format();
                  }

                  return { success: validation.success, errors };
            };

            describe('Username Validation', () => {
                  it('Should reject 2 length username with currect error message', () => {
                        const { success, errors } = formattedError({ username: '23' });
                        expect(success).toBe(false);

                        if (!success) {
                              const error = errors.username?._errors[0];
                              expect(error).toContain('Username must be at least 3 characters');
                        }
                  });

                  it('Should reject 21 length username with currect error message', () => {
                        const { success, errors } = formattedError({ username: '12345678912345678912345' });
                        expect(success).toBe(false);

                        if (!success) {
                              const error = errors.username?._errors[0];
                              expect(error).toContain('Username must be at most 20 characters');
                        }
                  });

                  it('Should reject username that used special character with currect error message', () => {
                        const { success, errors } = formattedError({ username: '234234f@3@@$!' });
                        expect(success).toBe(false);

                        if (!success) {
                              const error = errors.username?._errors[0];
                              expect(error).toContain('Username can only contain letters, numbers, and underscores');
                        }
                  });

                  it('Should accept valid username', () => {
                        const { success } = formattedError({
                              username: currectFormValues.username,
                              email: currectFormValues.email,
                              password: currectFormValues.password,
                        });

                        expect(success).toBe(true);
                  });

                  it('Should show Required Message for email and password when username is valid', () => {
                        const { success, errors } = formattedError({ username: currectFormValues.username });

                        expect(success).toBe(false);

                        if (!success) {
                              const email_error = errors.email._errors[0];
                              const pass_error = errors.password._errors[0];

                              expect(email_error).toContain('Required');
                              expect(pass_error).toContain('Required');
                        }
                  });
            });

            describe('Email Validation', () => {
                  it('Should Reject invalid email with currect error message and password be required', () => {
                        const { errors, success } = formattedError({
                              username: currectFormValues.username,
                              email: incurrectFormValues.email,
                        });
                        expect(success).toBe(false);

                        if (!success) {
                              const error_email = errors.email?._errors[0];
                              const error_pass = errors.password?._errors[0];
                              expect(error_email).toContain('Invalid email address');
                              expect(error_pass).toContain('Required');
                        }
                  });

                  it('Should accept valid email', () => {
                        const { success, errors } = formattedError({
                              username: currectFormValues.username,
                              email: 'test@example.com',
                              password: currectFormValues.password,
                        });
                        expect(success).toBe(true);
                  });

                  it('Should show Required Message for username and password when email is valid', () => {
                        const { success, errors } = formattedError({
                              email: currectFormValues.email,
                        });

                        expect(success).toBe(false);

                        if (!success) {
                              const username_error = errors.username._errors[0];
                              const pass_error = errors.password._errors[0];

                              expect(username_error).toContain('Required');
                              expect(pass_error).toContain('Required');
                        }
                  });
            });

            describe('Password Validation', () => {
                  it('Should reject short password with currect error message', () => {
                        const { success, errors } = formattedError({
                              username: currectFormValues.username,
                              email: currectFormValues.email,
                              password: '1234',
                        });
                        expect(success).toBe(false);

                        if (!success) {
                              const error_pass = errors.password?._errors[0];
                              expect(error_pass).toContain('Password must be at least 6 characters');
                        }
                  });

                  it('Should access +6 character password', () => {
                        const { success } = formattedError({
                              username: currectFormValues.username,
                              email: currectFormValues.email,
                              password: 'Mohammad',
                        });
                        expect(success).toBe(true);
                  });

                  it('Should show Required Message for username and email when password is valid', () => {
                        const { success, errors } = formattedError({
                              password: currectFormValues.password,
                        });

                        expect(success).toBe(false);

                        if (!success) {
                              const username_error = errors.username._errors[0];
                              const email_error = errors.email._errors[0];

                              expect(username_error).toContain('Required');
                              expect(email_error).toContain('Required');
                        }
                  });
            });
      });
});
