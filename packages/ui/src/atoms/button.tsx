'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-400 disabled:bg-sky-300 disabled:text-white',
        'secondary-gray':
          'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        ghost:
          'text-gray-600 hover:bg-gray-100 focus:ring-gray-400 shadow-none border-0',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        default: 'h-10 px-4 text-sm',
        lg: 'h-11 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
