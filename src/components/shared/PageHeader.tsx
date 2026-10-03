import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  children,
  className,
  badge,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-6 border-b border-slate-200/80 dark:border-slate-800', className)}>
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2.5 shrink-0">{children}</div>}
    </div>
  );
};
