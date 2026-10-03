import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, icon, className }) => {
  return (
    <div className={cn('flex items-start justify-between py-2 text-sm border-b border-slate-100 dark:border-slate-800/50 last:border-0', className)}>
      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 shrink-0">
        {icon}
        {label}
      </span>
      <span className="text-right text-xs font-semibold text-slate-900 dark:text-slate-100 ml-4">
        {value !== undefined && value !== null && value !== '' ? value : '-'}
      </span>
    </div>
  );
};

export interface InfoCardProps {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  action,
  children,
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        {action}
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  );
};
