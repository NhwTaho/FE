import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '@/components/shared/PageContainer';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { DateDisplay } from '@/components/shared/DateDisplay';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { warrantyService } from '@/services/warrantyService';
import { Warranty } from '@/types';
import {
  RotateCcw,
  ShieldCheck,
  Clock,
  AlertTriangle,
  MoreVertical,
  CheckCircle2,
} from 'lucide-react';

export const WarrantiesPage: React.FC = () => {
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await warrantyService.getWarranties();
      setWarranties(list);
    } catch (err) {
      console.error('Lỗi tải danh sách bảo hành:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredWarranties = useMemo(() => {
    return warranties.filter((w) => {
      const matchesSearch =
        !searchTerm ||
        w.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.productName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || w.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [warranties, searchTerm, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const counts = useMemo(() => {
    return {
      total: warranties.length,
      active: warranties.filter((w) => w.status === 'ACTIVE').length,
      expiringSoon: warranties.filter((w) => w.status === 'EXPIRING_SOON').length,
      expired: warranties.filter((w) => w.status === 'EXPIRED').length,
    };
  }, [warranties]);

  const columns = useMemo<ColumnDef<Warranty>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã phiếu BH',
        cell: ({ row }) => (
          <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {row.original.code}
          </span>
        ),
      },
      {
        accessorKey: 'serialNumber',
        header: 'Số Serial',
        cell: ({ row }) => (
          <span className="font-mono font-bold text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
            {row.original.serialNumber}
          </span>
        ),
      },
      {
        accessorKey: 'productName',
        header: 'Sản phẩm',
        cell: ({ row }) => (
          <div className="space-y-0.5 max-w-[220px]">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{row.original.productName}</p>
          </div>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Khách hàng sở hữu',
        cell: ({ row }) => (
          <div className="text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[180px] truncate">
            {row.original.customerName}
          </div>
        ),
      },
      {
        accessorKey: 'startDate',
        header: 'Ngày bắt đầu BH',
        cell: ({ row }) => <DateDisplay date={row.original.startDate} />,
      },
      {
        accessorKey: 'endDate',
        header: 'Ngày hết hạn BH',
        cell: ({ row }) => <DateDisplay date={row.original.endDate} />,
      },
      {
        accessorKey: 'warrantyType',
        header: 'Gói bảo hành',
        cell: ({ row }) => (
          <Badge variant="secondary" className="text-[11px] bg-purple-50 text-purple-700 border-purple-200">
            {row.original.warrantyType || 'STANDARD'}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái BH',
        cell: ({ row }) => <StatusBadge type="warranty" status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <DropdownMenu
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
          >
            <DropdownMenuItem onClick={() => alert(`Sổ bảo hành #${row.original.code}`)}>
              Xem sổ bảo hành
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Gia hạn bảo hành #${row.original.code}`)}>
              Gia hạn bảo hành
            </DropdownMenuItem>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <PageContainer>
      <PageHeader
        title="Bảo hành & Hậu mãi"
        description="Quản lý sổ bảo hành chính hãng theo serial máy, thời hạn hiệu lực và lịch bảo trì."
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Tổng sổ bảo hành" value={counts.total} icon={ShieldCheck} />
        <StatCard title="Còn hiệu lực" value={counts.active} icon={CheckCircle2} />
        <StatCard title="Sắp hết hạn BH" value={counts.expiringSoon} icon={Clock} />
        <StatCard title="Hết hạn BH" value={counts.expired} icon={AlertTriangle} />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Input
            type="text"
            placeholder="Tìm theo mã BH, Serial, khách hàng, máy..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-xs h-9"
          />

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44 text-xs h-9">
            <option value="all">Trạng thái: Tất cả</option>
            <option value="ACTIVE">Còn hiệu lực</option>
            <option value="EXPIRING_SOON">Sắp hết hạn</option>
            <option value="EXPIRED">Hết hạn</option>
            <option value="VOID">Mất hiệu lực</option>
          </Select>
        </div>

        {(searchTerm || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs text-slate-500 gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Main Warranties DataTable */}
      <DataTable columns={columns} data={filteredWarranties} isLoading={isLoading} searchPlaceholder="Tìm nhanh sổ bảo hành..." />
    </PageContainer>
  );
};
