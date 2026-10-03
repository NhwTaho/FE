import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '@/components/shared/PageContainer';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { DateDisplay } from '@/components/shared/DateDisplay';
import { DateRangeFilter } from '@/components/shared/DateRangeFilter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { orderService } from '@/services/orderService';
import { customerService } from '@/services/customerService';
import { productService } from '@/services/productService';
import { Order, Customer, Product } from '@/types';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Plus,
  MoreVertical,
  RotateCcw,
  Coffee,
  Download,
} from 'lucide-react';
import { exportToCSV } from '@/utils/export';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  // Create Order Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [orderList, custResult, prodResult] = await Promise.all([
        orderService.getOrders(),
        customerService.getCustomers(),
        productService.getProducts(),
      ]);
      setOrders(orderList);
      setCustomers(custResult);
      setProducts(prodResult);
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Search
      const matchesSearch =
        !searchTerm ||
        o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.customerPhone.includes(searchTerm);

      // Status
      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;

      // Payment Status
      const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;

      // Sales Channel
      const matchesChannel = channelFilter === 'all' || o.salesChannel === channelFilter;

      // Date Range
      let matchesDate = true;
      if (dateRange !== 'all') {
        const orderDate = new Date(o.orderDate);
        const now = new Date();
        if (dateRange === 'today') {
          matchesDate = orderDate.toDateString() === now.toDateString();
        } else if (dateRange === 'this_week') {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          matchesDate = orderDate >= startOfWeek;
        } else if (dateRange === 'this_month') {
          matchesDate =
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear();
        } else if (dateRange === 'last_month') {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
          matchesDate = orderDate >= lastMonth && orderDate <= endLastMonth;
        } else if (dateRange === 'this_quarter') {
          const currentQuarter = Math.floor(now.getMonth() / 3);
          const orderQuarter = Math.floor(orderDate.getMonth() / 3);
          matchesDate =
            currentQuarter === orderQuarter && orderDate.getFullYear() === now.getFullYear();
        } else if (dateRange === 'this_year') {
          matchesDate = orderDate.getFullYear() === now.getFullYear();
        }
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesChannel && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter, channelFilter, dateRange]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setChannelFilter('all');
    setDateRange('all');
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedProductId) return;

    const cust = customers.find((c) => c.id === selectedCustomerId);
    const prod = products.find((p) => p.id === selectedProductId);
    if (!cust || !prod) return;

    const totalPrice = prod.unitPrice * itemQuantity;
    const isEquipment = prod.type === 'EQUIPMENT';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `DH-2026-00${orders.length + 1}`,
      customerId: cust.id,
      customerName: cust.name,
      customerPhone: cust.phone,
      customerType: cust.type,
      salesChannel: 'DIRECT_SALES',
      status: isEquipment ? 'AWAITING_INSTALLATION' : 'COMPLETED',
      paymentStatus: 'PAID',
      subtotal: totalPrice,
      discountAmount: 0,
      taxAmount: Math.round(totalPrice * 0.1),
      totalAmount: Math.round(totalPrice * 1.1),
      paidAmount: Math.round(totalPrice * 1.1),
      debtAmount: 0,
      hasEquipment: isEquipment,
      items: [
        {
          id: `item-${Date.now()}`,
          productId: prod.id,
          productCode: prod.code,
          productName: prod.name,
          productType: prod.type,
          quantity: itemQuantity,
          unitPrice: prod.unitPrice,
          discount: 0,
          totalPrice,
          assignedSerials: isEquipment ? [`SN-${Date.now()}`] : undefined,
        },
      ],
      orderDate: new Date().toISOString(),
      shippingAddress: cust.address,
      salespersonName: 'Lê Hoàng Nam',
      notes: 'Đơn hàng tạo từ hệ thống Admin CRM',
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          date: new Date().toISOString(),
          action: 'Khởi tạo đơn hàng thành công',
          performedBy: 'Lê Hoàng Nam',
          type: 'order',
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    setIsCreateModalOpen(false);
    setSelectedCustomerId('');
    setSelectedProductId('');
    setItemQuantity(1);
  };

  // Columns definition
  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: 'orderNumber',
        header: 'Mã đơn',
        cell: ({ row }) => (
          <div className="space-y-1 whitespace-nowrap shrink-0 min-w-[120px]">
            <span className="font-bold font-mono text-slate-900 dark:text-slate-100 text-xs block whitespace-nowrap">
              {row.original.orderNumber}
            </span>
            {row.original.hasEquipment && (
              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1 whitespace-nowrap">
                <Coffee className="h-3 w-3 shrink-0 text-amber-600 dark:text-amber-400" />
                <span className="whitespace-nowrap">Chứa máy pha/xay</span>
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'customerName',
        header: 'Khách hàng',
        cell: ({ row }) => {
          const o = row.original;
          return (
            <div className="space-y-1 min-w-[150px]">
              <span className="font-semibold text-slate-900 dark:text-slate-100 block max-w-[200px] truncate text-xs">
                {o.customerName}
              </span>
              <StatusBadge type="customerType" status={o.customerType} showDot={false} />
            </div>
          );
        },
      },
      {
        accessorKey: 'items',
        header: 'Sản phẩm',
        cell: ({ row }) => {
          const items = row.original.items || [];
          const mainItem = items[0];
          return (
            <div className="text-xs space-y-0.5 max-w-[220px]">
              {mainItem && (
                <div className="font-medium text-slate-800 dark:text-slate-200 truncate">
                  {mainItem.productName}
                </div>
              )}
              {items.length > 1 && (
                <span className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
                  + {items.length - 1} sản phẩm khác
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'totalAmount',
        header: 'Tổng tiền',
        cell: ({ row }) => <MoneyDisplay amount={row.original.totalAmount} size="sm" />,
      },
      {
        accessorKey: 'paymentStatus',
        header: 'Thanh toán',
        cell: ({ row }) => <StatusBadge type="payment" status={row.original.paymentStatus} />,
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái đơn',
        cell: ({ row }) => <StatusBadge type="order" status={row.original.status} />,
      },
      {
        accessorKey: 'salesChannel',
        header: 'Kênh bán',
        cell: ({ row }) => <StatusBadge type="salesChannel" status={row.original.salesChannel || 'DIRECT_SALES'} showDot={false} />,
      },
      {
        accessorKey: 'orderDate',
        header: 'Ngày tạo',
        cell: ({ row }) => <DateDisplay date={row.original.orderDate} />,
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
            <DropdownMenuItem onClick={() => navigate(`/orders/${row.original.id}`)}>
              Xem chi tiết đơn hàng
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.print()}>
              In phiếu đơn hàng
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
        title="Đơn hàng"
        description="Quản lý đơn hàng bán máy pha, máy xay, hạt cà phê và vật tư phụ kiện"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(
                filteredOrders.map((o) => ({
                  'Mã đơn': o.orderNumber,
                  'Khách hàng': o.customerName,
                  'SĐT': o.customerPhone,
                  'Loại khách': o.customerType === 'BUSINESS' ? 'Doanh nghiệp' : 'Cá nhân',
                  'Tổng tiền (VND)': o.totalAmount,
                  'Trạng thái đơn': o.status,
                  'Thanh toán': o.paymentStatus,
                  'Kênh bán': o.salesChannel,
                  'Ngày tạo': new Date(o.orderDate).toLocaleDateString('vi-VN'),
                })),
                'Danh_Sach_Don_Hang'
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
            <span>Tạo đơn hàng</span>
          </Button>
        </div>
      </PageHeader>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-60 text-xs h-9"
          />

          {/* Filter Order Status */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40 text-xs h-9"
          >
            <option value="all">Trạng thái đơn: Tất cả</option>
            <option value="PENDING">Mới</option>
            <option value="CONFIRMED">Xác nhận</option>
            <option value="PROCESSING">Đang chuẩn bị</option>
            <option value="SHIPPED">Đang giao</option>
            <option value="AWAITING_INSTALLATION">Chờ lắp đặt</option>
            <option value="COMPLETED">Hoàn tất</option>
            <option value="CANCELLED">Hủy</option>
          </Select>

          {/* Filter Payment Status */}
          <Select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-44 text-xs h-9"
          >
            <option value="all">Thanh toán: Tất cả</option>
            <option value="UNPAID">Chưa thanh toán</option>
            <option value="PARTIAL">Thanh toán một phần</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="REFUNDED">Hoàn tiền</option>
          </Select>

          {/* Filter Sales Channel */}
          <Select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="w-40 text-xs h-9"
          >
            <option value="all">Kênh bán: Tất cả</option>
            <option value="SHOWROOM">Showroom</option>
            <option value="DIRECT_SALES">Sales trực tiếp</option>
            <option value="WEBSITE">Website</option>
            <option value="PARTNER">Đối tác</option>
          </Select>

          {/* Date Range Filter */}
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>

        {/* Reset Filter Button */}
        {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || channelFilter !== 'all' || dateRange !== 'all') && (
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

      {/* Main Orders DataTable */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        isLoading={isLoading}
        searchPlaceholder="Tìm nhanh đơn hàng..."
        onRowClick={(row) => navigate(`/orders/${row.id}`)}
      />

      {/* Create Order Modal */}
      <Dialog
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Tạo đơn hàng mới"
        description="Khởi tạo đơn bán thiết bị máy pha cà phê hoặc vật tư hạt cà phê."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateOrderSubmit} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Khách hàng *</label>
            <Select
              required
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">-- Chọn khách hàng --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.code} - {c.phone})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Sản phẩm chính *</label>
            <Select
              required
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">-- Chọn máy pha / hạt cà phê --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.type === 'EQUIPMENT' ? 'Thiết bị' : 'Vật tư'}] {p.name} - {p.unitPrice.toLocaleString('vi-VN')} ₫
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Số lượng *</label>
            <Input
              type="number"
              min={1}
              value={itemQuantity}
              onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
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
              Tạo đơn hàng
            </Button>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};
