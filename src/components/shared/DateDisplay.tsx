import React from 'react';
import { formatDate } from '@/utils/format';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DateDisplayProps {
  date: string | undefined | null;
  includeTime?: boolean;
  showIcon?: boolean;
  className?: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({
  date,
  includeTime = false,
  showIcon = false,
  className,
}) => {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-sm', className)}>
      {showIcon && <Calendar className="h-3.5 w-3.5 text-slate-400" />}
      <span>{formatDate(date, includeTime)}</span>
    </span>
  );
};
