import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { serialService } from '@/services/serialService';
import { productService } from '@/services/productService';
import { customerService } from '@/services/customerService';
import { MachineSerial, Product, Customer } from '@/types';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreVertical,
  RotateCcw,
  Cpu,
  Warehouse,
  CheckCircle2,
  Wrench,
  Download,
} from 'lucide-react';
import { exportToCSV } from '@/utils/export';

export const SerialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [serials, setSerials] = useState<MachineSerial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('all');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState('all');

  // Modal Create Serial State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSerialNumber, setNewSerialNumber] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('wh-1');
  const [manufactureYear, setManufactureYear] = useState(new Date().getFullYear());
  const [newSerialNotes, setNewSerialNotes] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [serList, prodList, custList] = await Promise.all([
        serialService.getSerials(),
        productService.getProducts(),
        customerService.getCustomers(),
      ]);
      setSerials(serList);
      setProducts(prodList.filter((p) => p.type === 'EQUIPMENT' || p.hasSerial));
      setCustomers(custList);
    } catch (err) {
      console.error('Lỗi khi tải danh sách Serial:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered serials list
  const filteredSerials = useMemo(() => {
    return serials.filter((s) => {
      // Search
      const matchesSearch =
        !searchTerm ||
        s.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.customerName && s.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.orderNumber && s.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      // Product
      const matchesProduct = productFilter === 'all' || s.productId === productFilter;

      // Warehouse
      const matchesWarehouse = warehouseFilter === 'all' || s.warehouseId === warehouseFilter;

      // Status
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

      // Customer
      const matchesCustomer = customerFilter === 'all' || s.customerId === customerFilter;

      return matchesSearch && matchesProduct && matchesWarehouse && matchesStatus && matchesCustomer;
    });
  }, [serials, searchTerm, productFilter, warehouseFilter, statusFilter, customerFilter]);

  // Unique Warehouses for Filter Dropdown
  const warehouseOptions = useMemo(() => {
    const map = new Map<string, string>();
    serials.forEach((s) => {
      if (s.warehouseId && s.warehouseName) {
        map.set(s.warehouseId, s.warehouseName);
      }
    });
    return Array.from(map.entries());
  }, [serials]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setProductFilter('all');
    setWarehouseFilter('all');
    setStatusFilter('all');
    setCustomerFilter('all');
  };

  const handleCreateSerialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerialNumber || !selectedProductId) return;

    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const warehouseName = selectedWarehouseId === 'wh-1' ? 'Kho Tổng TP.HCM' : 'Kho Bảo Trì Trung Tâm';

    const newSerial: MachineSerial = {
      id: `ser-${Date.now()}`,
      serialNumber: newSerialNumber.toUpperCase().trim(),
      productId: prod.id,
      productCode: prod.code,
      productName: prod.name,
      model: prod.brand,
      brand: prod.brand,
      origin: prod.origin || 'Ý (Italy)',
      manufactureYear: manufactureYear,
      status: 'IN_STOCK',
      warehouseId: selectedWarehouseId,
      warehouseName: warehouseName,
      stockEntryDate: new Date().toISOString(),
      notes: newSerialNotes || 'Serial máy khai báo mới',
      history: [
        {
          id: `h-${Date.now()}`,
          date: new Date().toISOString(),
          action: 'Khai báo Serial máy mới & Nhập kho',
          performedBy: 'Lê Hoàng Nam',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setSerials([newSerial, ...serials]);
    setIsCreateModalOpen(false);
    setNewSerialNumber('');
    setSelectedProductId('');
    setNewSerialNotes('');
  };

  // Summary Counts
  const counts = useMemo(() => {
    return {
      total: serials.length,
      inStock: serials.filter((s) => s.status === 'IN_STOCK').length,
      reserved: serials.filter((s) => s.status === 'RESERVED').length,
      installed: serials.filter((s) => s.status === 'INSTALLED' || s.status === 'UNDER_WARRANTY').length,
      underRepair: serials.filter((s) => s.status === 'UNDER_REPAIR' || s.status === 'MAINTENANCE').length,
    };
  }, [serials]);

  // Columns definition
  const columns = useMemo<ColumnDef<MachineSerial>[]>(
    () => [
      {
        accessorKey: 'serialNumber',
        header: 'Serial',
        cell: ({ row }) => (
          <div className="space-y-0.5">
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {row.original.serialNumber}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'productName',
        header: 'Sản phẩm',
        cell: ({ row }) => (
          <div className="space-y-0.5 max-w-[220px]">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{row.original.productName}</p>
            <p className="text-[11px] text-slate-400 font-mono">Mã: {row.original.productCode}</p>
          </div>
        ),
      },
      {
        accessorKey: 'model',
        header: 'Model / Thương hiệu',
        cell: ({ row }) => (
          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
            {row.original.model || row.original.brand}
          </div>
        ),
      },
      {
        accessorKey: 'warehouseName',
        header: 'Kho hiện tại',
        cell: ({ row }) => (
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {row.original.warehouseName}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái vòng đời',
        cell: ({ row }) => <StatusBadge type="serial" status={row.original.status} />,
      },
      {
        accessorKey: 'customerName',
        header: 'Khách hàng sở hữu',
        cell: ({ row }) => (
          <div className="text-xs max-w-[180px]">
            {row.original.customerName ? (
              <span className="font-medium text-slate-900 dark:text-slate-100 block truncate">
                {row.original.customerName}
              </span>
            ) : (
              <span className="text-slate-400 italic">—</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'orderNumber',
        header: 'Đơn hàng',
        cell: ({ row }) => (
          <div className="text-xs">
            {row.original.orderNumber ? (
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {row.original.orderNumber}
              </span>
            ) : (
              <span className="text-slate-400 italic">—</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'saleDate',
        header: 'Ngày bán',
        cell: ({ row }) => (
          <div className="text-xs">
            {row.original.saleDate ? (
              <DateDisplay date={row.original.saleDate} />
            ) : (
              <span className="text-slate-400 italic">—</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'warrantyEndDate',
        header: 'Bảo hành đến',
        cell: ({ row }) => (
          <div className="text-xs">
            {row.original.warrantyEndDate ? (
              <DateDisplay date={row.original.warrantyEndDate} />
            ) : (
              <span className="text-slate-400 italic">—</span>
            )}
          </div>
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
            <DropdownMenuItem onClick={() => navigate(`/serials/${row.original.id}`)}>
              Xem hồ sơ vòng đời
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Cập nhật trạng thái Serial ${row.original.serialNumber}`)}>
              Cập nhật trạng thái
            </DropdownMenuItem>
          </DropdownMenu>
        ),
      },
    ],
    [navigate]
  );

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader
        title="Quản lý Serial Máy Pha & Xay"
        description="Theo dõi toàn bộ vòng đời thiết bị: Nhập kho → Giữ hàng → Bán → Giao → Lắp đặt → Bàn giao → Bảo hành/Sửa chữa."
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(
                filteredSerials.map((s) => ({
                  'Mã Serial': s.serialNumber,
                  'Sản phẩm': s.productName,
                  'Model': s.model,
                  'Kho': s.warehouseName,
                  'Trạng thái Vòng đời': s.status,
                  'Khách hàng sở hữu': s.customerName || 'N/A',
                  'Đơn hàng': s.orderNumber || 'N/A',
                  'Bảo hành đến': s.warrantyEndDate ? new Date(s.warrantyEndDate).toLocaleDateString('vi-VN') : 'N/A',
                })),
                'Danh_Sach_Serial_Thiet_Bi'
              )
            }
            className="gap-2 text-xs"
          >
            <Download className="h-4 w-4 text-slate-500" />
            <span>Xuất Excel</span>
          </Button>
          <Button
            variant="brand"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Khai báo Serial mới</span>
          </Button>
        </div>
      </PageHeader>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard title="Tổng Serial" value={counts.total} icon={Cpu} />
        <StatCard title="Trong kho" value={counts.inStock} icon={Warehouse} />
        <StatCard title="Đang giữ hàng" value={counts.reserved} icon={CheckCircle2} />
        <StatCard title="Đang sử dụng/BH" value={counts.installed} icon={CheckCircle2} />
        <StatCard title="Đang bảo trì/Sửa" value={counts.underRepair} icon={Wrench} />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Serial Input */}
          <Input
            type="text"
            placeholder="Tìm theo Serial, sản phẩm, khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-xs h-9"
          />

          {/* Filter Status (All 10 MachineSerialStatus options) */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-44 text-xs h-9"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="IN_STOCK">Trong kho</option>
            <option value="RESERVED">Giữ hàng</option>
            <option value="SOLD">Đã bán</option>
            <option value="DELIVERED">Đã giao hàng</option>
            <option value="WAITING_INSTALLATION">Chờ lắp đặt</option>
            <option value="INSTALLED">Đã lắp đặt</option>
            <option value="UNDER_WARRANTY">Đang bảo hành</option>
            <option value="UNDER_REPAIR">Đang sửa chữa</option>
            <option value="MAINTENANCE">Đang bảo trì</option>
            <option value="RETIRED">Ngừng sử dụng</option>
          </Select>

          {/* Filter Product */}
          <Select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-44 text-xs h-9"
          >
            <option value="all">Sản phẩm: Tất cả</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          {/* Filter Warehouse */}
          <Select
            value={warehouseFilter}
            onChange={(e) => setWarehouseFilter(e.target.value)}
            className="w-40 text-xs h-9"
          >
            <option value="all">Kho: Tất cả</option>
            {warehouseOptions.map(([whId, whName]) => (
              <option key={whId} value={whId}>
                {whName}
              </option>
            ))}
          </Select>

          {/* Filter Customer */}
          <Select
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="w-44 text-xs h-9"
          >
            <option value="all">Khách hàng: Tất cả</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Reset Filter Button */}
        {(searchTerm || productFilter !== 'all' || warehouseFilter !== 'all' || statusFilter !== 'all' || customerFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs text-slate-500 hover:text-slate-900 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Main Serials DataTable */}
      <DataTable
        columns={columns}
        data={filteredSerials}
        isLoading={isLoading}
        searchPlaceholder="Tìm nhanh serial máy..."
        onRowClick={(row) => navigate(`/serials/${row.id}`)}
      />

      {/* Modal Declare New Serial */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Khai báo Serial máy mới"
        description="Nhập mã Serial chính hãng của máy pha hoặc máy xay khi nhập kho mới."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateSerialSubmit} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Sản phẩm máy *</label>
            <Select
              required
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">-- Chọn sản phẩm máy pha/xay --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.code}] {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Mã Serial (S/N) *</label>
            <Input
              required
              type="text"
              placeholder="VD: LM-2026-9901 hoặc MK-E65S-1044"
              value={newSerialNumber}
              onChange={(e) => setNewSerialNumber(e.target.value)}
              className="font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Kho nhập *</label>
              <Select
                value={selectedWarehouseId}
                onChange={(e) => setSelectedWarehouseId(e.target.value)}
              >
                <option value="wh-1">Kho Tổng TP.HCM</option>
                <option value="wh-2">Kho Bảo Trì Trung Tâm</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Năm sản xuất</label>
              <Input
                type="number"
                value={manufactureYear}
                onChange={(e) => setManufactureYear(parseInt(e.target.value) || 2026)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Ghi chú kiểm định</label>
            <Input
              type="text"
              placeholder="Ghi chú tem seal, chứng nhận CO/CQ..."
              value={newSerialNotes}
              onChange={(e) => setNewSerialNotes(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Lưu khai báo Serial
            </Button>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};
