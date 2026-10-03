import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className,
  autoFocus,
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-xs', className)}>
      <Search className="absolute left-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="pl-9 pr-8 text-xs h-9 bg-white dark:bg-slate-900"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          aria-label="Xóa từ khóa"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
