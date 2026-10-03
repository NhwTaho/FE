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
import { Dialog } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { installationService } from '@/services/installationService';
import { Installation } from '@/types';
import {
  Plus,
  RotateCcw,
  Wrench,
  CheckCircle2,
  Clock,
  MoreVertical,
  Calendar,
} from 'lucide-react';

export const InstallationsPage: React.FC = () => {
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal Create State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [technicianName, setTechnicianName] = useState('KTV Nguyễn Văn Đức');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await installationService.getInstallations();
      setInstallations(list);
    } catch (err) {
      console.error('Lỗi tải danh sách lắp đặt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInstallations = useMemo(() => {
    return installations.filter((inst) => {
      const matchesSearch =
        !searchTerm ||
        inst.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (inst.technicianName && inst.technicianName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || inst.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [installations, searchTerm, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !customerName) return;

    const newInst: Installation = {
      id: `inst-${Date.now()}`,
      code: `LD-2026-00${installations.length + 1}`,
      orderId: 'ord-102',
      orderNumber,
      customerId: 'cust-2',
      customerName,
      customerPhone: '0903112233',
      address: '27 Ngô Đức Kế, Q.1, TP.HCM',
      serialNumber: `SN-${Date.now()}`,
      productName: productName || 'La Marzocco Linea Classic S 2 Group',
      technicianName,
      scheduledDate: new Date().toISOString(),
      status: 'SCHEDULED',
      acceptanceSigned: false,
      createdAt: new Date().toISOString(),
    };

    setInstallations([newInst, ...installations]);
    setIsCreateModalOpen(false);
    setOrderNumber('');
    setCustomerName('');
  };

  const counts = useMemo(() => {
    return {
      total: installations.length,
      pending: installations.filter((i) => i.status === 'PENDING').length,
      scheduled: installations.filter((i) => i.status === 'SCHEDULED' || i.status === 'IN_PROGRESS').length,
      completed: installations.filter((i) => i.status === 'COMPLETED').length,
    };
  }, [installations]);

  const columns = useMemo<ColumnDef<Installation>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã phiếu',
        cell: ({ row }) => (
          <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {row.original.code}
          </span>
        ),
      },
      {
        accessorKey: 'orderNumber',
        header: 'Đơn hàng',
        cell: ({ row }) => (
          <span className="font-mono font-semibold text-xs text-slate-800 dark:text-slate-200">
            {row.original.orderNumber}
          </span>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Khách hàng',
        cell: ({ row }) => (
          <div className="space-y-0.5 max-w-[200px]">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{row.original.customerName}</p>
            <p className="text-[11px] text-slate-400 font-mono">{row.original.customerPhone}</p>
          </div>
        ),
      },
      {
        accessorKey: 'productName',
        header: 'Máy & Serial',
        cell: ({ row }) => (
          <div className="space-y-0.5 max-w-[220px]">
            <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{row.original.productName}</p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-mono font-bold">S/N: {row.original.serialNumber}</p>
          </div>
        ),
      },
      {
        accessorKey: 'technicianName',
        header: 'Kỹ thuật viên',
        cell: ({ row }) => (
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {row.original.technicianName || 'Chưa phân công'}
          </span>
        ),
      },
      {
        accessorKey: 'scheduledDate',
        header: 'Lịch lắp đặt',
        cell: ({ row }) => <DateDisplay date={row.original.scheduledDate} />,
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <StatusBadge type="installation" status={row.original.status} />,
      },
      {
        accessorKey: 'acceptanceSigned',
        header: 'Nghiệm thu',
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              row.original.acceptanceSigned
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
            }`}
          >
            {row.original.acceptanceSigned ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
            {row.original.acceptanceSigned ? 'Đã nghiệm thu' : 'Chưa ký'}
          </span>
        ),
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
            <DropdownMenuItem onClick={() => alert(`Chi tiết phiếu #${row.original.code}`)}>
              Xem phiếu lắp đặt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Cập nhật tiến độ #${row.original.code}`)}>
              Cập nhật tiến độ
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
        title="Lắp đặt Kỹ thuật"
        description="Lịch phân công kỹ thuật viên lắp đặt máy, nghiệm thu bàn giao tận nơi."
      >
        <Button variant="brand" size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Tạo phiếu lắp đặt</span>
        </Button>
      </PageHeader>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Tổng phiếu lắp đặt" value={counts.total} icon={Wrench} />
        <StatCard title="Chờ phân công" value={counts.pending} icon={Clock} />
        <StatCard title="Đã xếp lịch / Tiến hành" value={counts.scheduled} icon={Calendar} />
        <StatCard title="Đã bàn giao nghiệm thu" value={counts.completed} icon={CheckCircle2} />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Input
            type="text"
            placeholder="Tìm theo mã phiếu, đơn hàng, KH, KTV..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-xs h-9"
          />

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-44 text-xs h-9">
            <option value="all">Trạng thái: Tất cả</option>
            <option value="PENDING">Chờ phân công</option>
            <option value="SCHEDULED">Đã xếp lịch</option>
            <option value="IN_PROGRESS">Đang tiến hành</option>
            <option value="COMPLETED">Đã hoàn thành</option>
            <option value="FAILED">Thất bại</option>
            <option value="CANCELLED">Hủy lịch</option>
          </Select>
        </div>

        {(searchTerm || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs text-slate-500 gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Main Installations DataTable */}
      <DataTable columns={columns} data={filteredInstallations} isLoading={isLoading} searchPlaceholder="Tìm nhanh lịch lắp đặt..." />

      {/* Modal Create Installation */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} title="Tạo phiếu lắp đặt mới" maxWidth="max-w-md">
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Mã đơn hàng *</label>
            <Input required type="text" placeholder="VD: DH-2026-002" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Khách hàng *</label>
            <Input required type="text" placeholder="Tên khách hàng hoặc chuỗi quán" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Máy pha / xay lắp đặt</label>
            <Input type="text" placeholder="Tên máy pha espresso" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Kỹ thuật viên đảm nhận</label>
            <Select value={technicianName} onChange={(e) => setTechnicianName(e.target.value)}>
              <option value="KTV Nguyễn Văn Đức">KTV Nguyễn Văn Đức</option>
              <option value="KTV Lê Hoàng Nam">KTV Lê Hoàng Nam</option>
            </Select>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Tạo phiếu lắp đặt
            </Button>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};
