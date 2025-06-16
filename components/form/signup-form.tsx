'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import SignupAction from '@/utils/server-actions/signup.action';

export const signupSchema = z.object({
      username: z
            .string()
            .min(3, { message: 'Username must be at least 3 characters' })
            .max(20, { message: 'Username must be at most 20 characters' })
            .regex(/^[a-zA-Z0-9_]+$/, {
                  message: 'Username can only contain letters, numbers, and underscores',
            }),
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
      const form = useForm<SignupFormValues>({
            resolver: zodResolver(signupSchema),
            defaultValues: {
                  username: '',
                  password: '',
            },
      });

      const onSubmit = async (data: SignupFormValues) => {
            console.log(data);
            await SignupAction(data);
            // const { errors, success } = await LoginAction(data);
            // if (!success) {
            //       alert('Failed to login');
            // }
      };

      return (
            <Form {...form}>
                  <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn('flex flex-col gap-6', className)}
                        {...props}
                  >
                        <div className="flex flex-col items-center gap-2 text-center">
                              <h1 className="text-2xl font-bold">Create your account</h1>
                              <p className="text-muted-foreground text-sm text-balance">
                                    Join us today by filling out the form below
                              </p>
                        </div>
                        <div className="grid gap-6">
                              <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                          <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                      <Input
                                                            placeholder="your_username"
                                                            {...field}
                                                            // Add autoComplete for better UX
                                                            autoComplete="username"
                                                      />
                                                </FormControl>
                                                <FormMessage />
                                          </FormItem>
                                    )}
                              />
                              <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                          <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                      <Input placeholder="m@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                          </FormItem>
                                    )}
                              />
                              <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                          <FormItem>
                                                <div className="flex items-center">
                                                      <FormLabel>Password</FormLabel>
                                                      <a
                                                            href="#"
                                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                                      >
                                                            Forgot your password?
                                                      </a>
                                                </div>
                                                <FormControl>
                                                      <Input
                                                            type="password"
                                                            {...field}
                                                            // Add autoComplete for better UX
                                                            autoComplete="current-password"
                                                      />
                                                </FormControl>
                                                <FormMessage />
                                          </FormItem>
                                    )}
                              />
                              <Button type="submit" className="w-full">
                                    Create Account
                              </Button>
                        </div>
                        <div className="text-center text-sm">
                              Don&apos;t have an account?
                              <Link href="/auth/login" className="underline underline-offset-4">
                                    Login
                              </Link>
                        </div>
                  </form>
            </Form>
      );
}
