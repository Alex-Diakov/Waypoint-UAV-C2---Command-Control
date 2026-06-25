import React from 'react';
import { cn } from '../../lib/utils';

export interface DataPointProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  unit?: string;
  label: string;
}

export const DataPoint = React.forwardRef<HTMLDivElement, DataPointProps>(
  ({ value, unit, label, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-end gap-3", className)} {...props}>
      <div className="text-4xl font-mono tracking-tight text-tactical-text leading-none">{value}</div>
      <div className="flex flex-col pb-0.5">
        {unit && <span className="text-xs text-tactical-text">{unit}</span>}
        <span className="text-[10px] text-tactical-text-muted uppercase tracking-wider">{label}</span>
      </div>
    </div>
  )
);
DataPoint.displayName = 'DataPoint';

