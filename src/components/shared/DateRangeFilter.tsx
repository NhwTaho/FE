import React from 'react';
import { Calendar } from 'lucide-react';
import { Select } from '@/components/ui/select';

export interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md px-2.5 py-1">
      <Calendar className="h-3.5 w-3.5 text-slate-400" />
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 border-none bg-transparent p-0 text-xs focus:ring-0 w-auto cursor-pointer"
      >
        <option value="all">Tất cả thời gian</option>
        <option value="today">Hôm nay</option>
        <option value="this_week">Tuần này</option>
        <option value="this_month">Tháng này</option>
        <option value="last_month">Tháng trước</option>
        <option value="this_quarter">Quý này</option>
        <option value="this_year">Năm nay</option>
      </Select>
    </div>
  );
};
