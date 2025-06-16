"use client"

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Button, buttonVariants } from '../button';
import Spin from './spin';
import { VariantProps } from 'class-variance-authority';

const SubmitButton = ({
      text,
      ...props
}: React.ComponentProps<'button'> &
      VariantProps<typeof buttonVariants> & {
            asChild?: boolean;
            text: string
      }) => {
      const { pending } = useFormStatus();

      return <Button disabled={pending} {...props}>{pending ? <Spin /> : text}</Button>;
};

export default SubmitButton;
