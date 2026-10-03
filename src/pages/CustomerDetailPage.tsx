import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/shared/PageContainer';
import { DetailHeader } from '@/components/shared/DetailHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { DateDisplay } from '@/components/shared/DateDisplay';
import { StatCard } from '@/components/shared/StatCard';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { InfoCard, InfoRow } from '@/components/shared/InfoCard';
import { ActivityTimeline, TimelineItem } from '@/components/shared/ActivityTimeline';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { customerService } from '@/services/customerService';
import { orderService } from '@/services/orderService';
import { serialService } from '@/services/serialService';
import { warrantyService } from '@/services/warrantyService';
import { Customer, Order, MachineSerial, Warranty } from '@/types';
import {
  Phone,
  Mail,
  UserCheck,
  Building2,
  Coffee,
  Plus,
  Edit,
  ShoppingCart,
  MapPin,
  Clock,
  CheckSquare,
  MessageSquare,
  FileText,
  Barcode,
} from 'lucide-react';

export const CustomerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [serials, setSerials] = useState<MachineSerial[]>([]);
  const [warranties, setWarranties] = useState<Warranty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Note state
  const [newNoteText, setNewNoteText] = useState('');

  // New Interaction Modal state
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);
  const [newInteraction, setNewInteraction] = useState({
    type: 'CALL' as const,
    summary: '',
    performedBy: 'Lê Hoàng Nam',
  });

  const loadCustomerData = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const custData = await customerService.getCustomerById(id);
      if (custData) {
        setCustomer(custData);
        // Fetch related customer orders, serials, warranties
        const [allOrders, allSerials, allWarranties] = await Promise.all([
          orderService.getOrders(),
          serialService.getSerials(),
          warrantyService.getWarranties(),
        ]);

        setOrders(allOrders.filter((o) => o.customerId === custData.id));
        setSerials(allSerials.filter((s) => s.customerId === custData.id));
        setWarranties(allWarranties.filter((w) => w.customerId === custData.id));
      }
    } catch (err) {
      console.error('Lỗi khi tải chi tiết khách hàng:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerData();
  }, [id]);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState type="detail" />
      </PageContainer>
    );
  }

  if (!customer) {
    return (
      <PageContainer>
        <ErrorState
          title="Không tìm thấy khách hàng"
          message="Khách hàng này không tồn tại hoặc đã bị xóa khỏi hệ thống CRM."
          onRetry={() => navigate('/customers')}
        />
      </PageContainer>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const noteItem = {
      id: `n-${Date.now()}`,
      date: new Date().toISOString(),
      author: 'Lê Hoàng Nam',
      text: newNoteText,
    };

    setCustomer((prev) =>
      prev
        ? {
            ...prev,
            notes: [noteItem, ...(prev.notes || [])],
          }
        : null
    );
    setNewNoteText('');
  };

  const handleAddInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInteraction.summary.trim()) return;

    const interItem = {
      id: `i-${Date.now()}`,
      date: new Date().toISOString(),
      type: newInteraction.type,
      summary: newInteraction.summary,
      performedBy: newInteraction.performedBy,
    };

    setCustomer((prev) =>
      prev
        ? {
            ...prev,
            interactions: [interItem, ...(prev.interactions || [])],
          }
        : null
    );
    setNewInteraction({ type: 'CALL', summary: '', performedBy: 'Lê Hoàng Nam' });
    setIsAddInteractionOpen(false);
  };

  const timelineItems: TimelineItem[] = (customer.interactions || []).map((i) => ({
    id: i.id,
    date: i.date,
    action: i.type === 'CALL' ? 'Cuộc gọi điện' : i.type === 'MEETING' ? 'Cuộc gặp trực tiếp' : i.type === 'MAINTENANCE' ? 'Bảo trì máy' : 'Lắp đặt bàn giao',
    performedBy: i.performedBy,
    notes: i.summary,
    type: i.type === 'MAINTENANCE' ? 'maintenance' : i.type === 'INSTALLATION' ? 'installation' : 'status',
  }));

  return (
    <PageContainer>
      {/* Top Header */}
      <DetailHeader
        title={customer.name}
        subtitle={`Mã KH: ${customer.code} • Ngày tham gia: ${new Date(customer.createdAt).toLocaleDateString('vi-VN')}`}
        backUrl="/customers"
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge type="customerType" status={customer.type} />
            <StatusBadge type="customer" status={customer.status} />
          </div>
        }
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          <span>Chỉnh sửa</span>
        </Button>
        <Button variant="brand" size="sm" onClick={() => navigate('/orders')} className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span>Tạo đơn hàng</span>
        </Button>
      </DetailHeader>

      {/* Customer Quick Contact Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-orange-600" />
            <span className="font-mono font-semibold">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-sky-600" />
            <span>{customer.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span className="truncate max-w-sm">{customer.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-purple-600" />
            <span>Phụ trách: <strong className="text-slate-900 dark:text-slate-100">{customer.assignedStaff || 'Chưa phân công'}</strong></span>
          </div>
        </div>
      </div>

      {/* Overview Cards (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng chi tiêu"
          value={<MoneyDisplay amount={customer.totalSpent} size="xl" />}
          description="Tích lũy từ tất cả các đơn hàng"
        />
        <StatCard
          title="Tổng đơn hàng"
          value={`${customer.totalOrders} đơn`}
          description="Đơn bán máy, hạt & vật tư"
        />
        <StatCard
          title="Máy đang sở hữu"
          value={`${customer.machinesCount || serials.length} thiết bị`}
          description="Máy pha espresso & máy xay"
        />
        <StatCard
          title="Công nợ hiện tại"
          value={<MoneyDisplay amount={customer.debtAmount} size="xl" variant={customer.debtAmount > 0 ? 'destructive' : 'default'} />}
          description={customer.debtAmount > 0 ? 'Cần đôn đốc thu hồi công nợ' : 'Không có công nợ quá hạn'}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-full flex overflow-x-auto justify-start border border-slate-200/60 dark:border-slate-800">
          <TabsTrigger value="overview" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            <span>Tổng quan</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>Đơn hàng ({orders.length})</span>
          </TabsTrigger>
          <TabsTrigger value="equipment" className="gap-2">
            <Coffee className="h-3.5 w-3.5 text-amber-600" />
            <span>Thiết bị ({serials.length})</span>
          </TabsTrigger>
          <TabsTrigger value="warranties" className="gap-2">
            <Barcode className="h-3.5 w-3.5 text-purple-600" />
            <span>Bảo hành ({warranties.length})</span>
          </TabsTrigger>
          <TabsTrigger value="interactions" className="gap-2">
            <Clock className="h-3.5 w-3.5" />
            <span>Lịch sử tương tác</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Ghi chú & Công việc</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: TỔNG QUAN */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Details & Locations */}
            <div className="lg:col-span-2 space-y-6">
              <InfoCard title="Thông tin cơ bản & Pháp lý" icon={<Building2 className="h-4 w-4 text-slate-500" />}>
                <div className="space-y-1">
                  <InfoRow label="Tên khách hàng / Công ty" value={customer.name} />
                  <InfoRow label="Mã định danh (Code)" value={customer.code} />
                  <InfoRow label="Loại hình" value={<StatusBadge type="customerType" status={customer.type} />} />
                  {customer.type === 'BUSINESS' && (
                    <>
                      <InfoRow label="Tên công ty xuất hóa đơn" value={customer.companyName || customer.name} />
                      <InfoRow label="Mã số thuế (MST)" value={customer.taxCode || 'Chưa cập nhật'} />
                    </>
                  )}
                  <InfoRow label="Số điện thoại" value={customer.phone} />
                  <InfoRow label="Email" value={customer.email} />
                  <InfoRow label="Địa chỉ đăng ký" value={customer.address} />
                  <InfoRow label="Nhân viên phụ trách" value={customer.assignedStaff || 'Chưa phân công'} />
                </div>
              </InfoCard>

              {/* Branch Locations for Business Customers */}
              {customer.type === 'BUSINESS' && (
                <InfoCard
                  title={`Địa điểm kinh doanh & Chi nhánh (${customer.locations?.length || 0})`}
                  icon={<MapPin className="h-4 w-4 text-emerald-600" />}
                >
                  {customer.locations && customer.locations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {customer.locations.map((loc) => (
                        <div key={loc.id} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-purple-600" />
                              {loc.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              {loc.machinesCount} máy
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{loc.address}</p>
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex justify-between">
                            <span>Đại diện: <strong>{loc.contactPerson}</strong></span>
                            <span className="font-mono">{loc.contactPhone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-4 text-center">Chưa có chi nhánh phụ được ghi nhận.</p>
                  )}
                </InfoCard>
              )}
            </div>

            {/* Right 1 Col: Quick Notes & Stats */}
            <div className="space-y-6">
              <InfoCard title="Ghi chú gần nhất" icon={<MessageSquare className="h-4 w-4 text-sky-600" />}>
                {customer.notes && customer.notes.length > 0 ? (
                  <div className="space-y-3">
                    {customer.notes.slice(0, 3).map((n) => (
                      <div key={n.id} className="p-3 rounded bg-slate-50 dark:bg-slate-900 text-xs space-y-1 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-slate-400 text-[10px]">
                          <span>{n.author}</span>
                          <span>{new Date(n.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">"{n.text}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">Chưa có ghi chú.</p>
                )}
              </InfoCard>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: ĐƠN HÀNG */}
        <TabsContent value="orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Lịch sử đơn hàng của khách hàng</CardTitle>

            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {orders.length > 0 ? (
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-y border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Mã đơn hàng</th>
                      <th className="py-2.5 px-4 font-semibold">Ngày đặt</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Tổng tiền</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Đã thanh toán</th>
                      <th className="py-2.5 px-4 font-semibold text-right">Công nợ</th>
                      <th className="py-2.5 px-4 font-semibold">Trạng thái đơn</th>
                      <th className="py-2.5 px-4 font-semibold">Thanh toán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => navigate(`/orders/${o.id}`)}>
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {o.orderNumber}
                        </td>
                        <td className="py-3 px-4"><DateDisplay date={o.orderDate} /></td>
                        <td className="py-3 px-4 text-right"><MoneyDisplay amount={o.totalAmount} size="sm" /></td>
                        <td className="py-3 px-4 text-right"><MoneyDisplay amount={o.paidAmount} size="sm" variant="success" /></td>
                        <td className="py-3 px-4 text-right"><MoneyDisplay amount={o.debtAmount} size="sm" variant={o.debtAmount > 0 ? 'destructive' : 'muted'} /></td>
                        <td className="py-3 px-4"><StatusBadge type="order" status={o.status} /></td>
                        <td className="py-3 px-4"><StatusBadge type="payment" status={o.paymentStatus} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">Khách hàng chưa phát sinh đơn hàng nào.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: THIẾT BỊ (MÁY SỞ HỮU) */}
        <TabsContent value="equipment">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-amber-600" />
                  <span>Danh sách máy pha & máy xay đang sở hữu</span>
                </CardTitle>
                <p className="text-xs text-slate-500">Quản lý theo mã Serial, địa điểm lắp đặt và thời hạn bảo hành chính hãng</p>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {serials.length > 0 ? (
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-y border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Tên máy & Thương hiệu</th>
                      <th className="py-2.5 px-4 font-semibold">Số Serial</th>
                      <th className="py-2.5 px-4 font-semibold">Địa điểm lắp đặt</th>
                      <th className="py-2.5 px-4 font-semibold">Kỹ thuật phụ trách</th>
                      <th className="py-2.5 px-4 font-semibold">Trạng thái máy</th>
                      <th className="py-2.5 px-4 font-semibold">Hạn bảo hành</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {serials.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer" onClick={() => navigate(`/serials`)}>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-slate-100 max-w-[220px] truncate">{s.productName}</div>
                          <div className="text-[11px] text-slate-400">{s.brand} • Nsx: {s.manufactureYear || 2025}</div>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {s.serialNumber}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          {s.notes || 'Chi nhánh mặc định'}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{s.technicianName || 'KTV Nguyễn Văn Đức'}</td>
                        <td className="py-3 px-4"><StatusBadge type="serial" status={s.status} /></td>
                        <td className="py-3 px-4"><DateDisplay date={s.warrantyEndDate || '2027-02-20'} showIcon /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">Khách hàng chưa đăng ký máy nào theo serial.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: BẢO HÀNH */}
        <TabsContent value="warranties">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Sổ bảo hành & Yêu cầu kỹ thuật</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {warranties.length > 0 ? (
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-y border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Mã sổ bảo hành</th>
                      <th className="py-2.5 px-4 font-semibold">Số Serial</th>
                      <th className="py-2.5 px-4 font-semibold">Sản phẩm</th>
                      <th className="py-2.5 px-4 font-semibold">Ngày bắt đầu</th>
                      <th className="py-2.5 px-4 font-semibold">Ngày kết thúc</th>
                      <th className="py-2.5 px-4 font-semibold">Trạng thái bảo hành</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {warranties.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">{w.code}</td>
                        <td className="py-3 px-4 font-mono">{w.serialNumber}</td>
                        <td className="py-3 px-4">{w.productName}</td>
                        <td className="py-3 px-4"><DateDisplay date={w.startDate} /></td>
                        <td className="py-3 px-4"><DateDisplay date={w.endDate} /></td>
                        <td className="py-3 px-4"><StatusBadge type="warranty" status={w.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">Không có sổ bảo hành kích hoạt.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: LỊCH SỬ TƯƠNG TÁC */}
        <TabsContent value="interactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Lịch sử tương tác CRM & Hậu mãi</CardTitle>
                <p className="text-xs text-slate-500">Nhật ký các cuộc gọi, cuộc gặp, bảo trì và lắp đặt</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsAddInteractionOpen(true)} className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" />
                <span>Ghi nhận tương tác</span>
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityTimeline items={timelineItems} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: GHI CHÚ & CÔNG VIỆC */}
        <TabsContent value="notes">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Col: Internal Notes */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">Ghi chú chăm sóc nội bộ</CardTitle>

              </CardHeader>
              <CardContent className="space-y-3">
                <form onSubmit={handleAddNote} className="space-y-2">
                  <Input
                    placeholder="Nhập ghi chú mới cho khách hàng..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="text-xs"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="text-xs">Thêm ghi chú</Button>
                  </div>
                </form>

                <div className="space-y-2.5 pt-2">
                  {(customer.notes || []).map((n) => (
                    <div key={n.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{n.author}</span>
                        <span>{new Date(n.date).toLocaleString('vi-VN')}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200">"{n.text}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Right Col: Customer Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold">Công việc & Nhắc nhở (Tasks)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(customer.tasks || []).length > 0 ? (
                  <div className="space-y-2">
                    {(customer.tasks || []).map((t) => (
                      <div key={t.id} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start justify-between text-xs">
                        <div className="flex items-start gap-2.5">
                          <CheckSquare className="h-4 w-4 text-orange-600 mt-0.5" />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
                            <p className="text-[11px] text-slate-400">Phụ trách: {t.assignedTo}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[10px]">
                          Hạn: {new Date(t.dueDate).toLocaleDateString('vi-VN')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">Không có công việc cần làm.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Interaction Modal */}
      <Dialog
        open={isAddInteractionOpen}
        onOpenChange={setIsAddInteractionOpen}
        title="Ghi nhận tương tác mới"
        description="Ghi nhận nhật ký liên hệ, làm việc trực tiếp với khách hàng."
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddInteraction} className="space-y-4 pt-2 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Loại tương tác *</label>
            <Select
              value={newInteraction.type}
              onChange={(e) => setNewInteraction({ ...newInteraction, type: e.target.value as any })}
            >
              <option value="CALL">Cuộc gọi điện thoại</option>
              <option value="MEETING">Gặp mặt trực tiếp</option>
              <option value="MAINTENANCE">Đợt bảo trì máy</option>
              <option value="INSTALLATION">Lắp đặt bàn giao</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Tóm tắt nội dung làm việc *</label>
            <Input
              required
              placeholder="VD: Trao đổi về kế hoạch bảo trì tháng 10..."
              value={newInteraction.summary}
              onChange={(e) => setNewInteraction({ ...newInteraction, summary: e.target.value })}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddInteractionOpen(false)}>Hủy</Button>
            <Button type="submit" variant="brand" size="sm">Lưu nhật ký</Button>
          </div>
        </form>
      </Dialog>
    </PageContainer>
  );
};
