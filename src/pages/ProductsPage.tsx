import React, { useEffect, useState, useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '@/components/shared/PageContainer';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { StatCard } from '@/components/shared/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { productService } from '@/services/productService';
import { Product, ProductType } from '@/types';
import {
  Plus,
  RotateCcw,
  Package,
  Coffee,
  MoreVertical,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal Create State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState<ProductType>('EQUIPMENT');
  const [brand, setBrand] = useState('La Marzocco');
  const [unitPrice, setUnitPrice] = useState<number>(10000000);
  const [stockQuantity, setStockQuantity] = useState<number>(5);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await productService.getProducts();
      setProducts(list);
    } catch (err) {
      console.error('Lỗi tải danh sách sản phẩm:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [products, searchTerm, typeFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productCode || !productName) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      code: productCode.toUpperCase().trim(),
      name: productName,
      category: productType === 'EQUIPMENT' ? 'Máy pha cà phê' : 'Hạt & Vật tư',
      type: productType,
      brand,
      origin: 'Ý (Italy)',
      unitPrice,
      costPrice: Math.round(unitPrice * 0.75),
      stockQuantity,
      minStockThreshold: 2,
      unit: productType === 'EQUIPMENT' ? 'Máy' : 'Bao',
      status: 'ACTIVE',
      hasSerial: productType === 'EQUIPMENT',
      createdAt: new Date().toISOString(),
    };

    setProducts([newProd, ...products]);
    setIsCreateModalOpen(false);
    setProductCode('');
    setProductName('');
  };

  const counts = useMemo(() => {
    return {
      total: products.length,
      equipments: products.filter((p) => p.type === 'EQUIPMENT').length,
      consumables: products.filter((p) => p.type === 'CONSUMABLE').length,
      active: products.filter((p) => p.status === 'ACTIVE').length,
    };
  }, [products]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'code',
        header: 'Mã SP',
        cell: ({ row }) => (
          <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            {row.original.code}
          </span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Tên sản phẩm',
        cell: ({ row }) => (
          <div className="space-y-0.5 max-w-[260px]">
            <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{row.original.name}</p>
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
        accessorKey: 'brand',
        header: 'Thương hiệu / Xuất xứ',
        cell: ({ row }) => (
          <div className="text-xs">
            <span className="font-medium text-slate-800 dark:text-slate-200">{row.original.brand}</span>
            {row.original.origin && <span className="text-slate-400 block text-[11px]">{row.original.origin}</span>}
          </div>
        ),
      },
      {
        accessorKey: 'unitPrice',
        header: 'Giá bán niêm yết',
        cell: ({ row }) => <MoneyDisplay amount={row.original.unitPrice} size="sm" />,
      },
      {
        accessorKey: 'costPrice',
        header: 'Giá vốn',
        cell: ({ row }) => <MoneyDisplay amount={row.original.costPrice} size="sm" variant="muted" />,
      },
      {
        accessorKey: 'stockQuantity',
        header: 'Tồn kho',
        cell: ({ row }) => {
          const qty = row.original.stockQuantity;
          const isLow = qty <= row.original.minStockThreshold;
          return (
            <span
              className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                isLow
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
              }`}
            >
              {qty} {row.original.unit}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              row.original.status === 'ACTIVE'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            {row.original.status === 'ACTIVE' ? 'Đang kinh doanh' : 'Tạm dừng'}
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
            <DropdownMenuItem onClick={() => alert(`Chi tiết sản phẩm #${row.original.code}`)}>
              Xem thông tin
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Chỉnh sửa #${row.original.code}`)}>
              Chỉnh sửa
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
        title="Quản lý Sản phẩm"
        description="Danh mục thiết bị máy pha, máy xay, hạt cà phê specialty và vật tư thay thế."
      >
        <Button variant="brand" size="sm" onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Thêm sản phẩm</span>
        </Button>
      </PageHeader>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Tổng Sản phẩm" value={counts.total} icon={Package} />
        <StatCard title="Máy pha / xay (Equipment)" value={counts.equipments} icon={Coffee} />
        <StatCard title="Hạt & Vật tư (Consumable)" value={counts.consumables} icon={Layers} />
        <StatCard title="Đang kinh doanh" value={counts.active} icon={CheckCircle2} />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <Input
            type="text"
            placeholder="Tìm theo tên sản phẩm, mã SP, hãng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-xs h-9"
          />

          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-44 text-xs h-9">
            <option value="all">Phân loại: Tất cả</option>
            <option value="EQUIPMENT">Thiết bị (Máy)</option>
            <option value="CONSUMABLE">Vật tư / Hạt cà phê</option>
            <option value="ACCESSORY">Phụ kiện Barista</option>
            <option value="SPARE_PART">Linh kiện thay thế</option>
          </Select>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-40 text-xs h-9">
            <option value="all">Trạng thái: Tất cả</option>
            <option value="ACTIVE">Đang kinh doanh</option>
            <option value="INACTIVE">Tạm dừng</option>
          </Select>
        </div>

        {(searchTerm || typeFilter !== 'all' || statusFilter !== 'all') && (
          <Button variant="ghost" size="sm" onClick={handleResetFilters} className="text-xs text-slate-500 gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Main Products DataTable */}
      <DataTable columns={columns} data={filteredProducts} isLoading={isLoading} searchPlaceholder="Tìm nhanh sản phẩm..." />

      {/* Modal Add New Product */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen} title="Thêm sản phẩm mới" maxWidth="max-w-md">
        <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Phân loại sản phẩm *</label>
            <Select value={productType} onChange={(e) => setProductType(e.target.value as ProductType)}>
              <option value="EQUIPMENT">Thiết bị (Máy pha/xay - Quản lý bằng Serial)</option>
              <option value="CONSUMABLE">Vật tư (Hạt cà phê / Hóa chất - Quản lý theo SL)</option>
              <option value="ACCESSORY">Phụ kiện Barista</option>
              <option value="SPARE_PART">Linh kiện thay thế</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Mã sản phẩm (SKU) *</label>
            <Input required type="text" placeholder="VD: SP-LM-LINEA3G" value={productCode} onChange={(e) => setProductCode(e.target.value)} className="font-mono" />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Tên sản phẩm *</label>
            <Input required type="text" placeholder="Tên máy pha hoặc loại hạt cà phê" value={productName} onChange={(e) => setProductName(e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Thương hiệu / Hãng sản xuất</label>
            <Select value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="La Marzocco">La Marzocco</option>
              <option value="Nuova Simonelli">Nuova Simonelli</option>
              <option value="Mahlkönig">Mahlkönig</option>
              <option value="VietY Roastery">VietY Roastery</option>
              <option value="Urnex">Urnex</option>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Đơn giá bán (VND) *</label>
              <Input type="number" value={unitPrice} onChange={(e) => setUnitPrice(parseInt(e.target.value) || 0)} />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Số lượng ban đầu</label>
              <Input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Lưu sản phẩm
            </Button>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};
