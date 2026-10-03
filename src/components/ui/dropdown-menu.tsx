import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export interface DropdownMenuItemProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  destructive?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  children,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer inline-flex items-center"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[160px] rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-80 zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  children,
  onClick,
  destructive = false,
  disabled = false,
  className,
  icon: Icon,
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        if (disabled) return;
        onClick?.(e);
      }}
      className={cn(
        'w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors text-left',
        destructive
          ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      <span>{children}</span>
    </button>
  );
};

export const DropdownMenuSeparator: React.FC = () => (
  <div className="my-1 h-px bg-slate-100 dark:bg-slate-800" />
);
