import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Chưa có dữ liệu',
  description = 'Không tìm thấy thông tin phù hợp hoặc chưa có dữ liệu được khởi tạo.',
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 my-4">
      <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
        {icon || <FolderOpen className="h-8 w-8" />}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
