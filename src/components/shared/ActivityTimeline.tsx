import React from 'react';
import { formatDate } from '@/utils/format';
import { Clock, Wrench, Package, UserCheck, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TimelineItem {
  id: string;
  date: string;
  action: string;
  performedBy: string;
  notes?: string;
  type?: 'status' | 'maintenance' | 'order' | 'installation' | 'system';
}

export interface ActivityTimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ items, className }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-400">
        Chưa có lịch sử ghi nhận.
      </div>
    );
  }

  const getIcon = (type?: string) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="h-3.5 w-3.5 text-amber-500" />;
      case 'order':
        return <Package className="h-3.5 w-3.5 text-blue-500" />;
      case 'installation':
        return <UserCheck className="h-3.5 w-3.5 text-emerald-500" />;
      case 'status':
        return <Tag className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return <Clock className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  return (
    <div className={cn('relative space-y-4 pl-4 border-l border-slate-200 dark:border-slate-800 ml-2 py-1', className)}>
      {items.map((item) => (
        <div key={item.id} className="relative group">
          <div className="absolute -left-[23px] top-1 p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            {getIcon(item.type)}
          </div>
          <div className="space-y-1 bg-slate-50/50 dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-900 dark:text-slate-100">{item.action}</span>
              <span className="text-[11px] text-slate-400">{formatDate(item.date, true)}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thực hiện bởi: <span className="font-medium text-slate-700 dark:text-slate-300">{item.performedBy}</span>
            </p>
            {item.notes && (
              <p className="text-xs italic text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 mt-1">
                "{item.notes}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
