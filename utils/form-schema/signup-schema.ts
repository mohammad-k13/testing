import { z } from 'zod';

type SignupSchemaErrorsType = Record<keyof z.infer<typeof signupSchema>, Record<string, string>>;
export const signupSchemaErrors = {
      username: {
            shortUsername: 'Username must be at least 3 characters',
            longUsername: 'Username must be at most 20 characters',
            invalidUsername: 'Username can only contain letters, numbers, and underscores',
      },
      email: {
            invalidEmail: 'Invalid email address',
      },
      password: {
            invalidPassword: 'Password must be at least 6 characters',
      },
};
const signupSchema = z.object({
      username: z
            .string()
            .min(3, { message: signupSchemaErrors.username.shortUsername })
            .max(20, { message: signupSchemaErrors.username.longUsername })
            .regex(/^[a-zA-Z0-9_]+$/, {
                  message: signupSchemaErrors.username.invalidUsername,
            }),
      email: z.string().email({ message: signupSchemaErrors.email.invalidEmail }),
      password: z.string().min(6, { message: signupSchemaErrors.password.invalidPassword }),
});

export default signupSchema;
