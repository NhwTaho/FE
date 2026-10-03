import React from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'default' | 'full' | 'narrow';
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  maxWidth = 'default',
}) => {
  const maxWidthClasses = {
    default: 'max-w-[1440px]',
    full: 'max-w-full',
    narrow: 'max-w-5xl',
  };

  return (
    <div className={cn('mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6', maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
};
