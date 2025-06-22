import signupSchema, { signupSchemaErrors } from '@/utils/form-schema/signup-schema';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

type signupDataType = z.infer<typeof signupSchema>;
describe('SignupSchema', () => {
      const validData: signupDataType = {
            username: 'mohammadk13',
            email: 'mohammadk13@gmail.com',
            password: 'mohammadk13',
      };

      const invalidData: signupDataType = {
            username: '2',
            password: '234',
            email: 'mohammad',
      };

      const emptyData: signupDataType = {
            username: '',
            password: '',
            email: '',
      };

      const getVlidationError = (data: signupDataType): signupDataType & { success: boolean } => {
            const { success, error } = signupSchema.safeParse(data);

            const validationErrors = error?.flatten().fieldErrors;
            console.log({
                  username: validationErrors?.username?.[0] || '',
                  email: validationErrors?.email?.[0] || '',
                  password: validationErrors?.password?.[0] || '',
                  success,
            });

            return {
                  username: validationErrors?.username?.[0] || '',
                  email: validationErrors?.email?.[0] || '',
                  password: validationErrors?.password?.[0] || '',
                  success,
            };
      };

      it('Should reject empty data with currect message', () => {
            const { email, password, username, success } = getVlidationError(emptyData);

            expect(success).toBe(false);

            expect(username).toBe(signupSchemaErrors.username.shortUsername);
            expect(email).toBe(signupSchemaErrors.email.invalidEmail);
            expect(password).toBe(signupSchemaErrors.password.invalidPassword);
      });

      it('Should reject username more than 20 characters with currect message', () => {
            const { username, success } = getVlidationError({
                  username: '12341234123412341234omsdflf',
                  email: '',
                  password: '',
            });

            expect(success).toBe(false);
            expect(username).toBe(signupSchemaErrors.username.longUsername);
      });

      it('Should reject username inclucde special character with currect message', () => {
            const { username, success } = getVlidationError({
                  username: 'asldkjfsa@#$',
                  email: '',
                  password: '',
            });

            expect(success).toBe(false);
            expect(username).toBe(signupSchemaErrors.username.invalidUsername);
      });

      it('Should reject invalid email with currect message', () => {
            const { email, success } = getVlidationError({
                  username: validData.username,
                  email: invalidData.email,
                  password: validData.password,
            });

            expect(success).toBe(false);
            expect(email).toBe(signupSchemaErrors.email.invalidEmail);
      });

      it('Should reject short password with currect message', () => {
            const { password, success } = getVlidationError({
                  username: validData.username,
                  email: validData.email,
                  password: invalidData.password,
            });

            expect(success).toBe(false);
            expect(password).toBe(signupSchemaErrors.password.invalidPassword);
      });
});
