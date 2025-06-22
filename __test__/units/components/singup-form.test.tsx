import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { SignupForm } from '@/components/form/signup-form';
import userEvent from '@testing-library/user-event';
import { L } from 'vitest/dist/chunks/reporters.d.C1ogPriE.js';
import { ServerActionResult } from '@/types/utils/server-action';
import { z } from 'zod';
import signupSchema from '@/utils/form-schema/signup-schema';
import { mock } from 'node:test';

const mocked = vi.hoisted(() => {
      const push = vi.fn((url: string) => {});
      const useRouter = vi.fn(() => ({
            push,
      }));

      const signupAction = vi.fn(
            (data: any): ServerActionResult<any> => ({ message: '', success: false, payload: null }),
      );

      const toast = {
            error: vi.fn((message: string) => {}),
            success: vi.fn((message: string) => {}),
      };

      return {
            useRouter,
            push,
            signupAction,
            toast,
      };
});

vi.mock('next/navigation', () => ({
      useRouter: mocked.useRouter,
}));

vi.mock('@/utils/server-actions/signup.action', () => ({
      default: mocked.signupAction,
}));

vi.mock('sonner', () => ({
      toast: mocked.toast,
}));

describe('SignupForm', () => {
      function setup() {
            const container = render(<SignupForm />);
            const user = userEvent.setup();

            const usernameInput = container.getByLabelText('Username') as HTMLInputElement;
            const emailInput = container.getByLabelText('Email') as HTMLInputElement;
            const passwordInput = container.getByLabelText('Password') as HTMLInputElement;
            const signupButton = container.getByRole('button', { name: /create account/i });
            const loginLink = container.getByRole('link', { name: 'Login' });

            return {
                  container,
                  user,
                  containerEls: {
                        usernameInput,
                        emailInput,
                        passwordInput,
                        signupButton,
                        loginLink,
                  },
            };
      }

      const validData: z.infer<typeof signupSchema> = {
            username: 'mohammadk13',
            email: 'mohammad@gmail.com',
            password: 'mohammad1234',
      };

      const invalidData: z.infer<typeof signupSchema> = {
            username: '2',
            email: 'mohammad',
            password: '1234',
      };

      beforeEach(() => {
            cleanup();

            // clear mocks
            mocked.useRouter.mockClear();
      });

      it('Should render all needed elements in dom', () => {
            const {
                  containerEls: { emailInput, passwordInput, signupButton, usernameInput, loginLink },
            } = setup();

            expect(usernameInput).toBeInTheDocument();
            expect(emailInput).toBeInTheDocument();
            expect(passwordInput).toBeInTheDocument();
            expect(signupButton).toBeInTheDocument();
            expect(loginLink).toBeInTheDocument();
            expect(loginLink).toHaveAttribute('href', '/auth/login');
      });

      it('User should be able to write in inputs and click submit button', async () => {
            const {
                  user,
                  containerEls: { emailInput, passwordInput, usernameInput, signupButton },
            } = setup();

            await user.type(usernameInput, validData.username);
            await user.type(emailInput, validData.email);
            await user.type(passwordInput, validData.password);
            await user.click(signupButton);

            expect(mocked.signupAction).toHaveBeenCalled();
            expect(mocked.signupAction).toHaveBeenCalledWith(validData);

            expect(usernameInput.value).toBe(validData.username);
            expect(emailInput.value).toBe(validData.email);
            expect(passwordInput.value).toBe(validData.password);
      });

      describe('ValidationErrorMessage', () => {
            it('Should show currect error message for all inputs when form is empty', async () => {
                  const {
                        container,
                        containerEls: { signupButton },
                        user,
                  } = setup();

                  const { error } = signupSchema.safeParse({ email: '', username: '', password: '' });
                  const validationErrors = error?.flatten();

                  await user.click(signupButton);

                  const usernameRequiredErrorMessage = container.getByTestId('username-validation-error-msg');
                  const emailRequiredErrorMessage = container.getByTestId('email-validation-error-msg');
                  const passwordRequiredErrorMessage = container.getByTestId('password-validation-error-msg');

                  expect(usernameRequiredErrorMessage).toBeInTheDocument();
                  expect(usernameRequiredErrorMessage.textContent).toBe(validationErrors?.fieldErrors.username?.[0]);

                  expect(emailRequiredErrorMessage).toBeInTheDocument();
                  expect(emailRequiredErrorMessage.textContent).toBe(validationErrors?.fieldErrors.email?.[0]);

                  expect(passwordRequiredErrorMessage).toBeInTheDocument();
                  expect(passwordRequiredErrorMessage.textContent).toBe(validationErrors?.fieldErrors.password?.[0]);
            });
            it('Should show username more than 20 characters validtion error', async () => {
                  const { error } = signupSchema.safeParse({ username: 'asdfjasl234234234234234223424' });
                  const validationErrorMessage = error?.flatten().fieldErrors.username?.[0];

                  const {
                        container,
                        containerEls: { signupButton, usernameInput },
                        user,
                  } = setup();

                  await user.type(usernameInput, 'asdfjasl234234234234234223424');
                  await user.click(signupButton);

                  const usernameValidationErrorMsg = container.getByTestId('username-validation-error-msg');

                  expect(usernameValidationErrorMsg).toBeInTheDocument();
                  expect(usernameValidationErrorMsg.textContent).toBe(validationErrorMessage);
            });

            it('Should show username invalid character validtion error', async () => {
                  const { error } = signupSchema.safeParse({ username: 'sdfsdf@f' });
                  const validationErrorMessage = error?.flatten().fieldErrors.username?.[0];
                  console.log(validationErrorMessage);

                  const {
                        container,
                        containerEls: { signupButton, usernameInput },
                        user,
                  } = setup();

                  await user.type(usernameInput, 'sdfsdf@f');
                  await user.click(signupButton);

                  const usernameValidationErrorMsg = container.getByTestId('username-validation-error-msg');

                  expect(usernameValidationErrorMsg).toBeInTheDocument();
                  expect(usernameValidationErrorMsg.textContent).toBe(validationErrorMessage);
            });

            it('Should show email invalid email validtion error', async () => {
                  const { error } = signupSchema.safeParse({ email: 'sdfsdf@f' });
                  const validationErrorMessage = error?.flatten().fieldErrors.email?.[0];

                  const {
                        container,
                        containerEls: { signupButton, emailInput },
                        user,
                  } = setup();

                  await user.type(emailInput, 'sdfsdf@f');
                  await user.click(signupButton);

                  const emailValidationErrorMsg = container.getByTestId('email-validation-error-msg');

                  expect(emailValidationErrorMsg).toBeInTheDocument();
                  expect(emailValidationErrorMsg.textContent).toBe(validationErrorMessage);
            });

            it('Should show password short length validtion error', async () => {
                  const { error } = signupSchema.safeParse({ password: '234' });
                  const validationErrorMessage = error?.flatten().fieldErrors.password?.[0];

                  const {
                        container,
                        containerEls: { signupButton, passwordInput },
                        user,
                  } = setup();

                  await user.type(passwordInput, '234');
                  await user.click(signupButton);

                  const passwordlValidationErrorMsg = container.getByTestId('password-validation-error-msg');

                  expect(passwordlValidationErrorMsg).toBeInTheDocument();
                  expect(passwordlValidationErrorMsg.textContent).toBe(validationErrorMessage);
            });
      });

      describe('ResultToastMessage', () => {
            beforeEach(() => {
                  mocked.toast.error.mockClear();
                  mocked.toast.success.mockClear();
                  mocked.push.mockClear();
            });

            it('Should show error toast when action goes wrong', async () => {
                  mocked.signupAction.mockImplementation(() => ({ message: 'Faild to fetch', success: false }));

                  const {
                        user,
                        containerEls: { emailInput, passwordInput, signupButton, usernameInput },
                  } = setup();

                  await user.type(usernameInput, validData.username);
                  await user.type(emailInput, validData.email);
                  await user.type(passwordInput, validData.password);
                  await user.click(signupButton);

                  expect(mocked.toast.error).toHaveBeenCalled();
                  expect(mocked.toast.success).not.toHaveBeenCalled();
                  expect(mocked.toast.error).toHaveBeenCalledWith('Faild to fetch');
            });

            it('Should show success toast when action create user', async () => {
                  mocked.signupAction.mockImplementation(() => ({
                        message: 'User created successfuly',
                        success: true,
                        payload: { url: '/dashboard' },
                  }));

                  const {
                        user,
                        containerEls: { emailInput, passwordInput, signupButton, usernameInput },
                  } = setup();

                  await user.type(usernameInput, validData.username);
                  await user.type(emailInput, validData.email);
                  await user.type(passwordInput, validData.password);
                  await user.click(signupButton);

                  expect(mocked.toast.success).toHaveBeenCalled();
                  expect(mocked.toast.error).not.toHaveBeenCalled();
                  expect(mocked.toast.success).toHaveBeenCalledWith('User created successfuly');

                  expect(mocked.push).toHaveBeenCalled();
                  expect(mocked.push).toHaveBeenCalledWith('/dashboard');
            });
      });
});
