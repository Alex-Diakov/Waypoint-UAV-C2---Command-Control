import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-2 px-2 py-1 border text-[10px] font-mono font-bold uppercase',
  {
    variants: {
      status: {
        nominal: 'text-tactical-green border-tactical-green bg-tactical-green/10',
        warning: 'text-tactical-orange border-tactical-orange bg-tactical-orange/10',
        critical: 'text-tactical-red border-tactical-red bg-tactical-red/10',
        offline: 'text-tactical-text-muted border-tactical-border bg-tactical-offline/20',
      },
    },
    defaultVariants: {
      status: 'offline',
    },
  }
);

export type StatusType = 'nominal' | 'warning' | 'critical' | 'offline';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  label: string;
  status: StatusType;
}

export const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ className, status, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ status }), className)}
        {...props}
      >
        {label}
      </div>
    );
  }
);
StatusBadge.displayName = 'StatusBadge';

