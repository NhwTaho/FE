import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { PageContainer } from '@/components/shared/PageContainer';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog } from '@/components/ui/dialog';
import { customerService } from '@/services/customerService';
import { Customer, CustomerType } from '@/types';
import { DropdownMenu, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Plus,
  Building2,
  User,
  Phone,
  Mail,
  MoreVertical,
  UserCheck,
  Coffee,
  RotateCcw,
  Download,
} from 'lucide-react';
import { exportToCSV } from '@/utils/export';

export const CustomersPage: React.FC = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Add customer modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<{
    name: string;
    type: CustomerType;
    phone: string;
    email: string;
    address: string;
    taxCode: string;
    companyName: string;
    assignedStaff: string;
  }>({
    name: '',
    type: 'BUSINESS',
    phone: '',
    email: '',
    address: '',
    taxCode: '',
    companyName: '',
    assignedStaff: 'Lê Hoàng Nam',
  });

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách khách hàng:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Search term
      const matchesSearch =
        !searchTerm ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType = typeFilter === 'all' || c.type === typeFilter;

      // Staff filter
      const matchesStaff = staffFilter === 'all' || c.assignedStaff === staffFilter;

      // Status filter
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;

      return matchesSearch && matchesType && matchesStaff && matchesStatus;
    });
  }, [customers, searchTerm, typeFilter, staffFilter, statusFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStaffFilter('all');
    setStatusFilter('all');
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    const created: Customer = {
      id: `cust-${Date.now()}`,
      code: `KH-00${customers.length + 1}`,
      name: newCustomer.name,
      type: newCustomer.type,
      phone: newCustomer.phone,
      email: newCustomer.email || 'N/A',
      address: newCustomer.address || 'N/A',
      companyName: newCustomer.type === 'BUSINESS' ? newCustomer.companyName : undefined,
      taxCode: newCustomer.type === 'BUSINESS' ? newCustomer.taxCode : undefined,
      assignedStaff: newCustomer.assignedStaff,
      status: 'ACTIVE',
      totalOrders: 0,
      totalSpent: 0,
      debtAmount: 0,
      machinesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCustomers([created, ...customers]);
    setIsAddModalOpen(false);
    setNewCustomer({
      name: '',
      type: 'BUSINESS',
      phone: '',
      email: '',
      address: '',
      taxCode: '',
      companyName: '',
      assignedStaff: 'Lê Hoàng Nam',
    });
  };

  // Table Column Definitions
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Khách hàng',
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="space-y-0.5">
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {c.type === 'BUSINESS' ? (
                  <Building2 className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                ) : (
                  <User className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                )}
                <span className="truncate max-w-[220px]">{c.name}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                <span>{c.code}</span>
                {c.taxCode && <span>• MST: {c.taxCode}</span>}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'type',
        header: 'Loại',
        cell: ({ row }) => <StatusBadge type="customerType" status={row.original.type} />,
      },
      {
        accessorKey: 'phone',
        header: 'Liên hệ',
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="text-xs space-y-0.5">
              <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-mono">
                <Phone className="h-3 w-3 text-slate-400" />
                <span>{c.phone}</span>
              </div>
              {c.email && c.email !== 'N/A' && (
                <div className="flex items-center gap-1 text-slate-500 text-[11px] truncate max-w-[160px]">
                  <Mail className="h-3 w-3 text-slate-400" />
                  <span>{c.email}</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'totalSpent',
        header: 'Tổng chi tiêu',
        cell: ({ row }) => <MoneyDisplay amount={row.original.totalSpent} size="sm" />,
      },
      {
        accessorKey: 'totalOrders',
        header: 'Số đơn hàng',
        cell: ({ row }) => (
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {row.original.totalOrders} đơn
          </span>
        ),
      },
      {
        accessorKey: 'machinesCount',
        header: 'Thiết bị sở hữu',
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Coffee className="h-3 w-3" />
            {row.original.machinesCount} máy
          </span>
        ),
      },
      {
        accessorKey: 'assignedStaff',
        header: 'Người phụ trách',
        cell: ({ row }) => (
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <UserCheck className="h-3.5 w-3.5 text-sky-600" />
            {row.original.assignedStaff || 'Chưa phân công'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <StatusBadge type="customer" status={row.original.status} />,
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
            <DropdownMenuItem onClick={() => navigate(`/customers/${row.original.id}`)}>
              Xem thông tin chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => alert(`Chỉnh sửa khách hàng ${row.original.name}`)}>
              Chỉnh sửa thông tin
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
        title="Khách hàng"
        description="Quản lý khách hàng cá nhân và doanh nghiệp kinh doanh máy pha & hạt cà phê"
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              exportToCSV(
                filteredCustomers.map((c) => ({
                  'Mã KH': c.code,
                  'Tên khách hàng': c.name,
                  'Loại': c.type === 'BUSINESS' ? 'Doanh nghiệp' : 'Cá nhân',
                  'SĐT': c.phone,
                  'Email': c.email,
                  'Địa chỉ': c.address,
                  'Tổng chi tiêu (VND)': c.totalSpent,
                  'Số đơn hàng': c.totalOrders,
                })),
                'Danh_Sach_Khach_Hang'
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
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm khách hàng</span>
          </Button>
        </div>
      </PageHeader>

      {/* Filter Toolbar Extension */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Tìm theo tên, SĐT, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 text-xs h-9"
          />

          {/* Filter Customer Type */}
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-40 text-xs h-9"
          >
            <option value="all">Loại khách hàng: Tất cả</option>
            <option value="BUSINESS">Doanh nghiệp</option>
            <option value="PERSONAL">Cá nhân</option>
          </Select>

          {/* Filter Assigned Staff */}
          <Select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="w-44 text-xs h-9"
          >
            <option value="all">Người phụ trách: Tất cả</option>
            <option value="Lê Hoàng Nam">Lê Hoàng Nam</option>
            <option value="Nguyễn Văn Minh">Nguyễn Văn Minh</option>
            <option value="Trần Thị Mỹ">Trần Thị Mỹ</option>
          </Select>

          {/* Filter Status */}
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-40 text-xs h-9"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LEAD">Tiềm năng</option>
            <option value="INACTIVE">Tạm dừng</option>
          </Select>
        </div>

        {/* Reset Filter Button */}
        {(searchTerm || typeFilter !== 'all' || staffFilter !== 'all' || statusFilter !== 'all') && (
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

      {/* Main Customers DataTable */}
      <DataTable
        columns={columns}
        data={filteredCustomers}
        isLoading={isLoading}
        searchPlaceholder="Tìm nhanh khách hàng..."
        onRowClick={(row) => navigate(`/customers/${row.id}`)}
      />

      {/* Add Customer Modal */}
      <Dialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Thêm khách hàng mới"
        description="Khai báo thông tin khách hàng cá nhân hoặc doanh nghiệp sở hữu máy pha cà phê."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddCustomerSubmit} className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Loại khách hàng *
              </label>
              <Select
                value={newCustomer.type}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, type: e.target.value as CustomerType })
                }
              >
                <option value="BUSINESS">Doanh nghiệp (Chuỗi/Tiệm cà phê)</option>
                <option value="PERSONAL">Cá nhân (Gia đình)</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Người phụ trách *
              </label>
              <Select
                value={newCustomer.assignedStaff}
                onChange={(e) => setNewCustomer({ ...newCustomer, assignedStaff: e.target.value })}
              >
                <option value="Lê Hoàng Nam">Lê Hoàng Nam</option>
                <option value="Nguyễn Văn Minh">Nguyễn Văn Minh</option>
                <option value="Trần Thị Mỹ">Trần Thị Mỹ</option>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Tên khách hàng / Tên thương hiệu *
            </label>
            <Input
              required
              placeholder="VD: Passio Coffee Quận 1..."
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            />
          </div>

          {newCustomer.type === 'BUSINESS' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Tên công ty xuất hóa đơn
                </label>
                <Input
                  placeholder="VD: Công ty TNHH..."
                  value={newCustomer.companyName}
                  onChange={(e) => setNewCustomer({ ...newCustomer, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Mã số thuế</label>
                <Input
                  placeholder="VD: 0312984511..."
                  value={newCustomer.taxCode}
                  onChange={(e) => setNewCustomer({ ...newCustomer, taxCode: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Số điện thoại *</label>
              <Input
                required
                placeholder="VD: 0903112233..."
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Email liên hệ</label>
              <Input
                type="email"
                placeholder="contact@company.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Địa chỉ lắp đặt / Trụ sở</label>
            <Input
              placeholder="VD: 15 Lê Duẩn, Q.1, TP.HCM"
              value={newCustomer.address}
              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(false)}
            >
              Hủy
            </Button>
            <Button type="submit" variant="brand" size="sm">
              Lưu khách hàng
            </Button>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};
