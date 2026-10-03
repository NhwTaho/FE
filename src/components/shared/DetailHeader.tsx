import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  backUrl?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  subtitle,
  backUrl,
  badge,
  children,
  className,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backUrl) {
      navigate(backUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-6 border-b border-slate-200 dark:border-slate-800', className)}>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBack}
          aria-label="Quay lại"
          className="h-8 w-8 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
      {children && <div className="flex items-center gap-2.5 shrink-0">{children}</div>}
    </div>
  );
};
