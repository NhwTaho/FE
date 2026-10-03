import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  ChevronRight,
  Bell,
  Search,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { ThemePicker } from '@/components/shared/ThemePicker';

export interface AppHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const BREADCRUMB_MAP: Record<string, string> = {
  '': 'Tổng quan',
  dashboard: 'Dashboard',
  customers: 'Khách hàng',
  orders: 'Đơn hàng',
  products: 'Sản phẩm',
  inventory: 'Tồn kho',
  serials: 'Serial máy',
  installations: 'Lắp đặt',
  warranties: 'Bảo hành',
  leads: 'Khách hàng tiềm năng',
  opportunities: 'Cơ hội bán hàng',
  quotes: 'Báo giá',
  returns: 'Đổi trả / Hoàn tiền',
  categories: 'Danh mục',
  'price-lists': 'Bảng giá',
  'stock-movements': 'Nhập / Xuất kho',
  stocktaking: 'Kiểm kho',
  suppliers: 'Nhà cung cấp',
  'purchase-orders': 'Đơn mua hàng',
  'goods-receipts': 'Nhập hàng',
  maintenance: 'Bảo trì',
  tickets: 'Ticket hỗ trợ',
  cashflow: 'Thu / Chi',
  debts: 'Công nợ',
  invoices: 'Hóa đơn',
  reports: 'Báo cáo',
  users: 'Người dùng',
  roles: 'Phân quyền',
  settings: 'Cấu hình',
  'audit-logs': 'Nhật ký hoạt động',
};

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleCollapse }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shadow-2xs">
      {/* Left section: Collapse Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Tooltip content="Thu/Mở Sidebar">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-9 w-9 text-slate-600 dark:text-slate-300"
            aria-label="Thu/Mở Sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </Tooltip>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Link
            to="/"
            className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1.5 font-medium"
          >
            <img src="/logo.png" alt="Viety Logo" className="h-4 w-4 object-contain rounded-xs" />
            <span>Trang chủ</span>
          </Link>

          {pathSegments.length > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}

          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const label = BREADCRUMB_MAP[segment] || segment;

            return (
              <React.Fragment key={url}>
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                {isLast ? (
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">
                    {label}
                  </span>
                ) : (
                  <Link
                    to={url}
                    className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right section: Quick actions & User profile */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm nhanh (Cmd + K)..."
            className="h-8 w-48 lg:w-64 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        {/* Notifications */}
        <Tooltip content="Thông báo">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 relative text-slate-600 dark:text-slate-300"
            aria-label="Thông báo"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand ring-2 ring-white dark:ring-slate-900" />
          </Button>
        </Tooltip>

        {/* Theme Palette Picker */}
        <ThemePicker />

        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 flex items-center justify-center font-bold text-xs shadow-xs">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
              Nguyễn Văn Quản Lý
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Senior Admin / System Manager
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
