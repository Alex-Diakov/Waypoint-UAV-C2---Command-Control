import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib/utils';

const telemetryBarVariants = cva(
  'h-full',
  {
    variants: {
      color: {
        default: 'bg-tactical-green',
        warning: 'bg-tactical-orange',
        critical: 'bg-tactical-red',
        offline: 'bg-tactical-text-muted',
      }
    },
    defaultVariants: {
      color: 'default'
    }
  }
);

export interface TelemetryBarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof telemetryBarVariants> {
  label: string;
  value: number;
  showValue?: boolean;
  colorClass?: string; // Kept for backward compatibility
}

export const TelemetryBar = React.forwardRef<HTMLDivElement, TelemetryBarProps>(
  ({ label, value, color, colorClass, showValue = true, className, ...props }, ref) => {
    // Backward compatibility for colorClass
    let appliedColor = color;
    if (colorClass) {
      if (colorClass.includes('tactical-red') || colorClass.includes('red')) appliedColor = 'critical';
      else if (colorClass.includes('tactical-orange') || colorClass.includes('amber')) appliedColor = 'warning';
      else if (colorClass.includes('tactical-green')) appliedColor = 'default';
    }

    return (
      <div ref={ref} className={cn("flex flex-col gap-1 w-full", className)} {...props}>
        <div className="flex justify-between items-end">
          <span className="text-[10px] text-tactical-text-muted uppercase tracking-wider">{label}</span>
          {showValue && <span className="text-xs font-mono text-tactical-text">{value}%</span>}
        </div>
        <div className="h-1 w-full bg-tactical-bg border-y border-tactical-border/50">
          <div className={cn(telemetryBarVariants({ color: appliedColor }))} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
        </div>
      </div>
    );
  }
);
TelemetryBar.displayName = 'TelemetryBar';

