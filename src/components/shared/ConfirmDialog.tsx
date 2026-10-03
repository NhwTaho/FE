import React from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'brand' | 'default';
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy bỏ',
  variant = 'destructive',
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} maxWidth="max-w-md">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
          <AlertCircle className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-2.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onOpenChange(false)}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : variant === 'brand' ? 'brand' : 'default'}
          size="sm"
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : confirmLabel}
        </Button>
      </div>
    </Dialog>
  );
};
