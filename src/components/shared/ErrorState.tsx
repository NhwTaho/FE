import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Tải dữ liệu thất bại',
  message = 'Đã có lỗi xảy ra trong quá trình xử lý. Vui lòng kiểm tra lại kết nối và thử lại.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border border-rose-200 dark:border-rose-900/50 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 my-4">
      <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 mb-3">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4 gap-2 border-rose-300 text-rose-700 hover:bg-rose-100">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Thử lại</span>
        </Button>
      )}
    </div>
  );
};
