import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  TrendingUp,
  FileText,
  ShoppingCart,
  RotateCcw,
  Coffee,
  Grid,
  Tag,
  Warehouse,
  ArrowUpDown,
  Barcode,
  ClipboardCheck,
  Truck,
  FileSpreadsheet,
  PackageCheck,
  Wrench,
  ShieldCheck,
  Headphones,
  DollarSign,
  CreditCard,
  Receipt,
  BarChart3,
  UserCog,
  ShieldAlert,
  Settings,
  History,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  isMvp?: boolean;
  badge?: string;
}

export interface NavGroup {
  title: string;
  icon?: React.ElementType;
  items: NavItem[];
}

const SIDEBAR_GROUPS: NavGroup[] = [
  {
    title: 'Tổng quan',
    items: [{ title: 'Dashboard', href: '/', icon: LayoutDashboard, isMvp: true }],
  },
  {
    title: 'CRM',
    items: [
      { title: 'Khách hàng', href: '/customers', icon: Users, isMvp: true },
      { title: 'Khách hàng tiềm năng', href: '/leads', icon: UserCheck },
      { title: 'Cơ hội bán hàng', href: '/opportunities', icon: TrendingUp },
      { title: 'Báo giá', href: '/quotes', icon: FileText },
    ],
  },
  {
    title: 'Bán hàng',
    items: [
      { title: 'Đơn hàng', href: '/orders', icon: ShoppingCart, isMvp: true },
      { title: 'Đổi trả / Hoàn tiền', href: '/returns', icon: RotateCcw },
    ],
  },
  {
    title: 'Sản phẩm',
    items: [
      { title: 'Sản phẩm', href: '/products', icon: Coffee, isMvp: true },
      { title: 'Danh mục', href: '/categories', icon: Grid },
      { title: 'Bảng giá', href: '/price-lists', icon: Tag },
    ],
  },
  {
    title: 'Kho',
    items: [
      { title: 'Tồn kho', href: '/inventory', icon: Warehouse, isMvp: true },
      { title: 'Nhập / Xuất kho', href: '/stock-movements', icon: ArrowUpDown },
      { title: 'Serial máy', href: '/serials', icon: Barcode, isMvp: true },
      { title: 'Kiểm kho', href: '/stocktaking', icon: ClipboardCheck },
    ],
  },
  {
    title: 'Mua hàng',
    items: [
      { title: 'Nhà cung cấp', href: '/suppliers', icon: Truck },
      { title: 'Đơn mua hàng', href: '/purchase-orders', icon: FileSpreadsheet },
      { title: 'Nhập hàng', href: '/goods-receipts', icon: PackageCheck },
    ],
  },
  {
    title: 'Kỹ thuật & Hậu mãi',
    items: [
      { title: 'Lắp đặt', href: '/installations', icon: Wrench, isMvp: true },
      { title: 'Bảo hành', href: '/warranties', icon: ShieldCheck, isMvp: true },
      { title: 'Bảo trì', href: '/maintenance', icon: Wrench },
      { title: 'Ticket hỗ trợ', href: '/tickets', icon: Headphones },
    ],
  },
  {
    title: 'Tài chính',
    items: [
      { title: 'Thu / Chi', href: '/cashflow', icon: DollarSign },
      { title: 'Công nợ', href: '/debts', icon: CreditCard },
      { title: 'Hóa đơn', href: '/invoices', icon: Receipt },
    ],
  },
  {
    title: 'Báo cáo',
    items: [{ title: 'Báo cáo', href: '/reports', icon: BarChart3 }],
  },
  {
    title: 'Hệ thống',
    items: [
      { title: 'Người dùng', href: '/users', icon: UserCog },
      { title: 'Phân quyền', href: '/roles', icon: ShieldAlert },
      { title: 'Cấu hình', href: '/settings', icon: Settings },
      { title: 'Nhật ký hoạt động', href: '/audit-logs', icon: History },
    ],
  },
];

export interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed }) => {
  const location = useLocation();
  const { sidebarStyle } = useTheme();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    SIDEBAR_GROUPS.forEach((g) => {
      init[g.title] = true;
    });
    return init;
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const isLight = sidebarStyle === 'light';

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out border-r flex flex-col',
        isLight
          ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
          : 'bg-slate-900 text-slate-300 border-slate-800',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'h-16 flex items-center px-3.5 border-b shrink-0 gap-3',
          isLight ? 'border-slate-200 dark:border-slate-800' : 'border-slate-800'
        )}
      >
        <div className="h-9 w-9 rounded-lg bg-white shrink-0 shadow-xs border border-slate-200/80 p-1 flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="VIETY COFFEE Logo" className="h-full w-full object-contain" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h2
              className={cn(
                'font-bold text-sm tracking-wide leading-tight truncate',
                isLight ? 'text-slate-900 dark:text-slate-100' : 'text-white'
              )}
            >
              VIETY COFFEE
            </h2>
            <p className="text-[11px] text-slate-400 font-mono truncate">CRM & ERP System</p>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin">
        {SIDEBAR_GROUPS.map((group) => {
          const isOpen = openGroups[group.title];
          return (
            <div key={group.title} className="space-y-1">
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors',
                    isLight ? 'text-slate-400 dark:text-slate-500 hover:text-slate-700' : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span>{group.title}</span>
                  {isOpen ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}

              {(collapsed || isOpen) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.href);

                    const content = (
                      <NavLink
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-all group relative',
                          isActive
                            ? 'bg-brand text-white shadow-sm font-semibold'
                            : isLight
                            ? 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                            isActive
                              ? 'text-white'
                              : isLight
                              ? 'text-slate-400 group-hover:text-slate-700'
                              : 'text-slate-400 group-hover:text-slate-200'
                          )}
                        />
                        {!collapsed && (
                          <span className="truncate flex-1">{item.title}</span>
                        )}
                        {!collapsed && item.isMvp && (
                          <span
                            className={cn(
                              'text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase',
                              isActive ? 'bg-white/20 text-white' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            )}
                          >
                            MVP
                          </span>
                        )}
                      </NavLink>
                    );

                    if (collapsed) {
                      return (
                        <Tooltip key={item.href} content={item.title} position="right">
                          {content}
                        </Tooltip>
                      );
                    }

                    return <React.Fragment key={item.href}>{content}</React.Fragment>;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer System Status */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
            <span>Hệ thống v1.0 MVP Ready</span>
          </div>
        </div>
      )}
    </aside>
  );
};
