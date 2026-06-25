import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors border focus:outline-none disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-transparent text-tactical-text-muted border-tactical-border hover:bg-tactical-surface-hover hover:text-tactical-text',
        active: 'bg-tactical-border text-tactical-text border-tactical-border-light',
        danger: 'bg-tactical-red/10 text-tactical-red border-tactical-red hover:bg-tactical-red hover:text-tactical-bg',
        ghost: 'border-transparent text-tactical-text-muted hover:text-tactical-text hover:bg-tactical-surface',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-[10px]',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  active?: boolean; // Kept for backward compatibility, translates to variant="active"
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, active, icon, children, ...props }, ref) => {
    // Backward compatibility for `active` prop
    const appliedVariant = active ? 'active' : variant;
    
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant: appliedVariant, size, className }))}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

