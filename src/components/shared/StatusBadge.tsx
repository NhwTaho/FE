import React from 'react';
import { getStatusConfig, StatusConfig } from '@/utils/status';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  type: 'customer' | 'customerType' | 'productType' | 'order' | 'payment' | 'serial' | 'installation' | 'warranty' | 'inventory' | 'salesChannel';
  status: string;
  customLabel?: string;
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  status,
  customLabel,
  className,
  showDot = true,
}) => {
  const config: StatusConfig = getStatusConfig(type, status);
  const displayLabel = customLabel || config.label;

  const dotColors: Record<string, string> = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    destructive: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] leading-tight font-medium border transition-colors whitespace-nowrap shrink-0 select-none',
        config.badgeClass,
        className
      )}
    >
      {showDot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[config.tone] || 'bg-slate-400')}
          aria-hidden="true"
        />
      )}
      <span className="whitespace-nowrap">{displayLabel}</span>
    </span>
  );
};
