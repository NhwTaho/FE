import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '@/components/shared/PageContainer';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { inventoryService } from '@/services/inventoryService';
import { InventoryItem } from '@/types';
import {
  RotateCcw,
  Warehouse,
  Package,
  Coffee,
  AlertTriangle,
  MoreVertical,
  ArrowRightLeft,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const items = await inventoryService.getInventory();
      setInventory(items);
    } catch (err) {
      console.error('Lỗi tải tồn kho:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouseName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesWh = warehouseFilter === 'all' || item.warehouseId === warehouseFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;

      return matchesSearch && matchesWh && matchesStatus && matchesType;
    });
  }, [inventory, searchTerm, warehouseFilter, statusFilter, typeFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setWarehouseFilter('all');
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const counts = useMemo(() => {
    return {
      totalItems: inventory.length,
      equipments: inventory.filter((i) => i.type === 'EQUIPMENT').length,
      consumables: inventory.filter((i) => i.type === 'CONSUMABLE').length,
      lowStock: inventory.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length,
    };
  }, [inventory]);

  const columns = useMemo<ColumnDef<InventoryItem>[]>(
    () => [
      {
        accessorKey: 'warehouseName',
        header: 'Kho lưu trữ',
        cell: ({ row }) => (
          <div className="font-medium text-xs text-slate-800 dark:text-slate-200">
            {row.original.warehouseName}
          </div>
        ),
      },
      {
        accessorKey: 'productCode',
        header: 'Mã SP',
        cell: ({ row }) => (
          <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {row.original.productCode}
          </span>
        ),
      },
      {
        accessorKey: 'productName',
        header: 'Tên sản phẩm',
        cell: ({ row }) => (
          <div className="space-y-0.5 max-w-[240px]">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{row.original.productName}</p>
            <p className="text-[11px] text-slate-400">{row.original.category}</p>
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Phân loại',
        cell: ({ row }) => <StatusBadge type="productType" status={row.original.type} showDot={false} />,
      },
      {
        accessorKey: 'currentStock',
        header: 'Tồn thực tế',
        cell: ({ row }) => (
          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
            {row.original.currentStock}
          </span>
        ),
      },
      {
        accessorKey: 'reservedStock',
        header: 'Giữ hàng đơn',
        cell: ({ row }) => (
          <span className="font-semibold text-xs text-amber-600 dark:text-amber-400">
            {row.original.reservedStock}
          </span>
        ),
      },
      {
        accessorKey: 'availableStock',
        header: 'Khả dụng bán',
        cell: ({ row }) => (
          <span className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
            {row.original.availableStock}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái kho',
        cell: ({ row }) => <StatusBadge type="inventory" status={row.original.status} />,
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
            <DropdownMenuItem onClick={() => alert(`Kiểm kê #${row.original.productCode}`)}>
              Kiểm kê kho
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Điều chuyển #${row.original.productCode}`)}>
              Tạo lệnh điều chuyển
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
        title="Quản lý Tồn kho"
        description="Theo dõi số lượng tồn thực tế, tồn giữ cho đơn bán và cảnh báo mức tồn tối thiểu."
      >
        <Button variant="brand" size="sm" onClick={() => alert('Chức năng Tạo phiếu kiểm kho')} className="gap-2">
          <ArrowRightLeft className="h-4 w-4" />
          <span>Lệnh điều chuyển kho</span>
        </Button>
      </PageHeader>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Mặt hàng tồn kho" value={counts.totalItems} icon={Package} />
        <StatCard title="Máy pha/xay tồn kho" value={counts.equipments} icon={Coffee} />
        <StatCard title="Hạt & Vật tư tồn kho" value={counts.consumables} icon={Warehouse} />
        <StatCard title="Cảnh báo sắp hết" value={counts.lowStock} icon={AlertTriangle} />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Input
            type="text"
            placeholder="Tìm theo sản phẩm, mã SP, tên kho..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-xs h-9"
          />

          <Select value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)} className="w-44 text-xs h-9">
            <option value="all">Kho: Tất cả</option>
            <option value="wh-1">Kho Tổng TP.Hồ Chí Minh</option>
            <option value="wh-2">Kho Chi nhánh Hà Nội</option>
          </Select>

          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-40 text-xs h-9">
            <option value="all">Loại SP: Tất cả</option>
            <option value="EQUIPMENT">Máy pha/xay</option>
            <option value="CONSUMABLE">Hạt / Vật tư</option>
          </Select>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40 text-xs h-9">
            <option value="all">Trạng thái tồn: Tất cả</option>
            <option value="NORMAL">Đủ hàng</option>
            <option value="LOW_STOCK">Sắp hết hàng</option>
            <option value="OUT_OF_STOCK">Hết hàng</option>
          </Select>
        </div>

        {(searchTerm || warehouseFilter !== 'all' || statusFilter !== 'all' || typeFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs text-slate-500 gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Main Inventory DataTable */}
      <DataTable columns={columns} data={filteredInventory} isLoading={isLoading} searchPlaceholder="Tìm nhanh tồn kho..." />
    </PageContainer>
  );
};
