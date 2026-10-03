import React from 'react';
import { formatMoney } from '@/utils/format';
import { cn } from '@/lib/utils';

export interface MoneyDisplayProps {
  amount: number | undefined | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'success' | 'destructive' | 'warning' | 'muted';
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  className,
  size = 'md',
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'text-xs font-medium',
    md: 'text-sm font-semibold',
    lg: 'text-base font-bold',
    xl: 'text-xl font-bold tracking-tight',
  };

  const variantClasses = {
    default: 'text-slate-900 dark:text-slate-100',
    success: 'text-emerald-600 dark:text-emerald-400',
    destructive: 'text-rose-600 dark:text-rose-400',
    warning: 'text-amber-600 dark:text-amber-400',
    muted: 'text-slate-500 dark:text-slate-400',
  };

  return (
    <span className={cn('tabular-nums font-mono', sizeClasses[size], variantClasses[variant], className)}>
      {formatMoney(amount)}
    </span>
  );
};
