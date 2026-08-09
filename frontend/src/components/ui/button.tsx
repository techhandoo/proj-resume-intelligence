import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-control)] text-sm font-medium ' +
    'transition-[transform,background-color,border-color,color,box-shadow,filter] duration-150 ease-[var(--ease-out)] ' +
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-brand to-brand/85 text-white hover:from-brand/95 hover:to-brand/75 ' +
          'shadow-[0_1px_0_0_rgba(255,255,255,0.18)_inset,0_8px_24px_-10px_rgba(59,130,246,0.55)]',
        destructive:
          'bg-[var(--color-danger)] text-white hover:bg-[color:var(--color-danger)]/90',
        outline:
          'border border-border bg-background text-[var(--color-text-secondary)] hover:bg-surface hover:text-[var(--color-text-primary)]',
        secondary:
          'border border-border bg-surface-2 text-[var(--color-text-primary)] hover:bg-surface-hover',
        ghost:
          'text-[var(--color-text-secondary)] hover:bg-surface-2 hover:text-[var(--color-text-primary)]',
        link: 'text-[var(--color-accent-strong)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
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
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
