import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'end';
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  align = 'end',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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
    <div className="relative inline-block text-left" ref={popoverRef}>
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
            'absolute z-50 mt-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl ring-1 ring-black/5 animate-in fade-in-80 zoom-in-95',
            align === 'right' || align === 'end' ? 'right-0' : 'left-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
