import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { cn } from '@/lib/utils';

export const AppShell: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
      {/* Fixed Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
          collapsed ? 'pl-16' : 'pl-64'
        )}
      >
        {/* Top Header */}
        <AppHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Page View Container */}
        <main className="flex-1 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
