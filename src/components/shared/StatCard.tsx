import React from 'react';
import { Card } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconColor = 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800',
  className,
}) => {
  return (
    <Card className={cn('p-5 flex flex-col justify-between hover:shadow-md transition-shadow', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {value}
          </div>
        </div>
        {Icon && (
          <div className={cn('p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(trend || description) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded-xs',
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
              )}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
