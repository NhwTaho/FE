import React, { useState } from 'react';
import { Filter, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

export interface FilterPopoverProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
  onReset: () => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  groups,
  selectedFilters,
  onFilterChange,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeCount = Object.values(selectedFilters).filter(Boolean).length;

  const handleSelect = (groupId: string, val: string) => {
    const next = { ...selectedFilters };
    if (next[groupId] === val) {
      delete next[groupId];
    } else {
      next[groupId] = val;
    }
    onFilterChange(next);
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        variant={activeCount > 0 ? 'brand' : 'outline'}
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 text-xs"
      >
        <Filter className="h-3.5 w-3.5" />
        <span>Bộ lọc</span>
        {activeCount > 0 && (
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
            {activeCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 z-40 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Lọc dữ liệu
            </h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {groups.map((group) => (
              <div key={group.id} className="space-y-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {group.title}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((opt) => {
                    const isSelected = selectedFilters[group.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(group.id, opt.value)}
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors border cursor-pointer',
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onReset();
                setIsOpen(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-900"
            >
              Xóa bộ lọc
            </Button>
            <Button size="sm" onClick={() => setIsOpen(false)} className="text-xs">
              Áp dụng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
