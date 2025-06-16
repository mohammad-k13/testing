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
import SubmitButton from '../ui/custom.tsx/submit-button';
import signupSchema from '@/utils/form-schema/signup-schema';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Spin from '../ui/custom.tsx/spin';

export type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<'form'>) {
      const { push } = useRouter();
      const [pending, startTransition] = useTransition();
      const form = useForm<SignupFormValues>({
            resolver: zodResolver(signupSchema),
            defaultValues: {
                  username: '',
                  password: '',
            },
      });

      const onSubmit = async (data: SignupFormValues) => {
            startTransition(async () => {
                  const { message, success, payload } = await SignupAction(data);
                  toast[success ? 'success' : 'error'](message);
                  if (success) {
                        push(payload.url);
                  }
            });
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
                                                      <Input placeholder="your_username" {...field} />
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
                                                      <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                          </FormItem>
                                    )}
                              />
                              <Button className="w-full">{pending ? <Spin /> : 'Create Account'}</Button>
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
