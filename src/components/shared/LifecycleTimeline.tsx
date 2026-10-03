import React from 'react';
import { MachineSerialStatus } from '@/types';
import {
  Warehouse,
  BookmarkCheck,
  ShoppingCart,
  Truck,
  Wrench,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LifecycleTimelineProps {
  status: MachineSerialStatus;
  stockDate?: string;
  reserveDate?: string;
  saleDate?: string;
  deliveryDate?: string;
  installationDate?: string;
  handoverDate?: string;
  warrantyEndDate?: string;
}

interface StepItem {
  key: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  date?: string;
}

export const LifecycleTimeline: React.FC<LifecycleTimelineProps> = ({
  status,
  stockDate,
  reserveDate,
  saleDate,
  deliveryDate,
  installationDate,
  handoverDate,
  warrantyEndDate,
}) => {
  // Determine current active step index (1-based)
  const getActiveStep = (s: MachineSerialStatus): number => {
    switch (s) {
      case 'IN_STOCK':
        return 1;
      case 'RESERVED':
        return 2;
      case 'SOLD':
        return 3;
      case 'DELIVERED':
        return 4;
      case 'WAITING_INSTALLATION':
        return 5;
      case 'INSTALLED':
        return 6;
      case 'UNDER_WARRANTY':
      case 'UNDER_REPAIR':
      case 'MAINTENANCE':
      case 'RETIRED':
        return 7;
      default:
        return 1;
    }
  };

  const activeIndex = getActiveStep(status);

  const steps: StepItem[] = [
    {
      key: 'IN_STOCK',
      label: 'Nhập kho',
      sublabel: 'Kiểm định & lưu kho',
      icon: Warehouse,
      date: stockDate,
    },
    {
      key: 'RESERVED',
      label: 'Giữ hàng',
      sublabel: 'Gán theo đơn bán',
      icon: BookmarkCheck,
      date: reserveDate,
    },
    {
      key: 'SOLD',
      label: 'Bán',
      sublabel: 'Xuất hóa đơn & thanh toán',
      icon: ShoppingCart,
      date: saleDate,
    },
    {
      key: 'DELIVERED',
      label: 'Giao hàng',
      sublabel: 'Vận chuyển đến mặt bằng',
      icon: Truck,
      date: deliveryDate,
    },
    {
      key: 'INSTALLED',
      label: 'Lắp đặt',
      sublabel: 'Đấu nối & cân chỉnh 9 bar',
      icon: Wrench,
      date: installationDate,
    },
    {
      key: 'HANDOVER',
      label: 'Bàn giao',
      sublabel: 'Ký biên bản nghiệm thu',
      icon: ShieldCheck,
      date: handoverDate,
    },
    {
      key: 'AFTER_SALES',
      label: 'Bảo hành / Bảo trì',
      sublabel: status === 'UNDER_REPAIR' ? 'Đang sửa chữa' : status === 'MAINTENANCE' ? 'Đang bảo trì' : 'Chăm sóc hậu mãi',
      icon: CheckCircle2,
      date: warrantyEndDate ? `Hạn BH: ${new Date(warrantyEndDate).toLocaleDateString('vi-VN')}` : undefined,
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Vòng đời thiết bị (Lifecycle Stepper)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Trạng thái hiện tại: <span className="font-semibold text-slate-900 dark:text-slate-100">{steps[activeIndex - 1]?.label || status}</span>
          </p>
        </div>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden lg:grid grid-cols-7 gap-2 relative">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isPassed = stepNum < activeIndex;
          const isCurrent = stepNum === activeIndex;
          const isFuture = stepNum > activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex flex-col items-center text-center group relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-4 left-[50%] w-full h-[2px] -z-0 transition-colors',
                    stepNum < activeIndex ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
                  )}
                />
              )}

              {/* Node Icon */}
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all border-2',
                  isPassed && 'bg-emerald-50 border-emerald-500 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-500 dark:text-emerald-400',
                  isCurrent && 'bg-amber-500 border-amber-600 text-white shadow-md shadow-amber-500/20 ring-4 ring-amber-100 dark:ring-amber-950/60',
                  isFuture && 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                )}
              >
                {isPassed ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>

              {/* Text Information */}
              <div className="mt-2 space-y-0.5">
                <p
                  className={cn(
                    'text-xs font-bold',
                    isCurrent && 'text-amber-600 dark:text-amber-400',
                    isPassed && 'text-slate-800 dark:text-slate-200',
                    isFuture && 'text-slate-400'
                  )}
                >
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight max-w-[100px] truncate">{step.sublabel}</p>
                {step.date && (
                  <p className="text-[10px] font-mono text-slate-500 mt-1 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                    {step.date.includes('Hạn') ? step.date : new Date(step.date).toLocaleDateString('vi-VN')}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile & Tablet Vertical Stepper */}
      <div className="lg:hidden space-y-3 pl-2">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isPassed = stepNum < activeIndex;
          const isCurrent = stepNum === activeIndex;
          const isFuture = stepNum > activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.key} className="flex items-start gap-3 relative">
              {idx < steps.length - 1 && (
                <div
                  className={cn(
                    'absolute left-3.5 top-8 w-[2px] h-full -z-0',
                    stepNum < activeIndex ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                  )}
                />
              )}
              <div
                className={cn(
                  'h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold z-10 shrink-0 border-2',
                  isPassed && 'bg-emerald-50 border-emerald-500 text-emerald-600',
                  isCurrent && 'bg-amber-500 border-amber-600 text-white',
                  isFuture && 'bg-slate-50 border-slate-200 text-slate-400'
                )}
              >
                {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <div className="pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className={cn('font-bold', isCurrent && 'text-amber-600', isPassed && 'text-slate-800', isFuture && 'text-slate-400')}>
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                      Hiện tại
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">{step.sublabel}</p>
                {step.date && <p className="text-[10px] text-slate-400 font-mono mt-0.5">{step.date}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
