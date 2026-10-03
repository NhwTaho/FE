import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '@/components/shared/PageContainer';
import { DetailHeader } from '@/components/shared/DetailHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { DateDisplay } from '@/components/shared/DateDisplay';
import { InfoCard, InfoRow } from '@/components/shared/InfoCard';
import { ActivityTimeline, TimelineItem } from '@/components/shared/ActivityTimeline';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import {
  User,
  Phone,
  MapPin,
  Building2,
  Truck,
  Wrench,
  FileCheck,
  CreditCard,
  Coffee,
  Package,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await orderService.getOrderById(id);
      if (data) {
        setOrder(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải chi tiết đơn hàng:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState type="detail" />
      </PageContainer>
    );
  }

  if (!order) {
    return (
      <PageContainer>
        <ErrorState
          title="Không tìm thấy đơn hàng"
          message="Đơn hàng này không tồn tại hoặc đã bị xóa khỏi hệ thống."
          onRetry={() => navigate('/orders')}
        />
      </PageContainer>
    );
  }

  // Determine if this order has equipment items
  const containsEquipment = order.hasEquipment || order.items.some((i) => i.productType === 'EQUIPMENT');

  const timelineItems: TimelineItem[] = (order.statusHistory || []).map((sh) => ({
    id: sh.id,
    date: sh.date,
    action: sh.action,
    performedBy: sh.performedBy,
    notes: sh.notes,
    type: sh.type === 'delivery' ? 'order' : sh.type === 'installation' ? 'installation' : sh.type === 'handover' ? 'status' : 'order',
  }));

  return (
    <PageContainer>
      {/* Detail Header */}
      <DetailHeader
        title={`Đơn hàng #${order.orderNumber}`}
        subtitle={`Ngày đặt: ${new Date(order.orderDate).toLocaleDateString('vi-VN')} • Nhân viên phụ trách: ${order.salespersonName}`}
        backUrl="/orders"
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge type="order" status={order.status} />
            <StatusBadge type="payment" status={order.paymentStatus} />
            <StatusBadge type="salesChannel" status={order.salesChannel || 'DIRECT_SALES'} showDot={false} />
          </div>
        }
      >
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" />
          <span>In đơn hàng</span>
        </Button>
      </DetailHeader>

      {/* Visual Workflow Tracker Header */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Tiến trình xử lý đơn hàng (Order Lifecycle)
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Step 1: Order */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">1. Đặt hàng</p>
              <p className="text-[11px] text-slate-500"><DateDisplay date={order.orderDate} /></p>
            </div>
          </div>

          <ChevronRight className="hidden sm:block h-4 w-4 text-slate-300 shrink-0" />

          {/* Step 2: Delivery */}
          <div className="flex items-center gap-3">
            <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${order.deliveryInfo?.status ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
              <Truck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">2. Giao hàng</p>
              <p className="text-[11px] text-slate-500">{order.deliveryInfo?.status || 'Đang chuẩn bị'}</p>
            </div>
          </div>

          {/* Step 3 & 4: Installation & Handover (Only shown if contains EQUIPMENT!) */}
          {containsEquipment ? (
            <>
              <ChevronRight className="hidden sm:block h-4 w-4 text-slate-300 shrink-0" />
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${order.installationInfo?.acceptanceSigned ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'}`}>
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">3. Lắp đặt KTV</p>
                  <p className="text-[11px] text-slate-500">{order.installationInfo?.status || 'Chờ xếp lịch'}</p>
                </div>
              </div>

              <ChevronRight className="hidden sm:block h-4 w-4 text-slate-300 shrink-0" />
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${order.installationInfo?.acceptanceSigned ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">4. Bàn giao & Bảo hành</p>
                  <p className="text-[11px] text-slate-500">{order.installationInfo?.acceptanceSigned ? 'Đã nghiệm thu' : 'Chưa nghiệm thu'}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
              <Package className="h-4 w-4 text-amber-500" />
              <span>Đơn hàng chỉ chứa hạt/vật tư tiêu hao (Không cần lắp đặt)</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Main Sections (Product List, Delivery, Installation, Invoice, Status History) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 2 PRODUCT LIST */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Coffee className="h-4 w-4 text-amber-600" />
                  <span>2. Danh sách sản phẩm trong đơn ({order.items.length})</span>
                </CardTitle>
                <p className="text-xs text-slate-500">Chi tiết mặt hàng, số serial gán cho máy và tình trạng nghiệm thu</p>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-y border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Sản phẩm</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Đơn giá</th>
                    <th className="py-2.5 px-4 font-semibold text-center">SL</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Giảm giá</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {order.items.map((item) => {
                    const isEq = item.productType === 'EQUIPMENT';
                    return (
                      <React.Fragment key={item.id}>
                        <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{item.productName}</div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                              <span>Mã: {item.productCode}</span>
                              <StatusBadge type="productType" status={item.productType} showDot={false} />
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right"><MoneyDisplay amount={item.unitPrice} size="sm" /></td>
                          <td className="py-3.5 px-4 text-center font-bold text-slate-800 dark:text-slate-200">{item.quantity}</td>
                          <td className="py-3.5 px-4 text-right"><MoneyDisplay amount={item.discount} size="sm" variant="muted" /></td>
                          <td className="py-3.5 px-4 text-right font-bold"><MoneyDisplay amount={item.totalPrice} size="sm" /></td>
                        </tr>

                        {/* Special Equipment Details Row if Product is EQUIPMENT */}
                        {isEq && (
                          <tr className="bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/40">
                            <td colSpan={5} className="py-2.5 px-4">
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px] text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-amber-800 dark:text-amber-400">Số Serial:</span>
                                  <span className="font-mono font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                                    {item.assignedSerials?.[0] || 'Đã giữ trong kho'}
                                  </span>
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-500">Ngày giao:</span>{' '}
                                  <DateDisplay date={item.deliveryDate || order.deliveryDate} />
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-500">KTV lắp đặt:</span>{' '}
                                  <strong>{item.technicianName || 'KTV Nguyễn Văn Đức'}</strong>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-slate-500">Nghiệm thu:</span>{' '}
                                  {item.acceptanceSigned ? (
                                    <span className="font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-0.5">
                                      <CheckCircle2 className="h-3 w-3" /> Đã bàn giao
                                    </span>
                                  ) : (
                                    <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-0.5">
                                      <Clock className="h-3 w-3" /> Chưa nghiệm thu
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* 4 DELIVERY */}
          <InfoCard title="4. Thông tin giao hàng (Delivery)" icon={<Truck className="h-4 w-4 text-sky-600" />}>
            <div className="space-y-1">
              <InfoRow label="Đơn vị vận chuyển" value={order.deliveryInfo?.carrier || 'Đội xe giao nhận VietY Coffee'} />
              <InfoRow label="Mã vận đơn / Phiếu xuất" value={order.deliveryInfo?.trackingNumber || 'DEL-2026-8812'} />
              <InfoRow label="Địa chỉ giao hàng" value={order.deliveryInfo?.address || order.shippingAddress} />
              <InfoRow label="Ngày giao dự kiến" value={<DateDisplay date={order.deliveryInfo?.estimatedDate || order.deliveryDate} />} />
              <InfoRow label="Ngày giao thực tế" value={<DateDisplay date={order.deliveryInfo?.actualDate} />} />
              <InfoRow label="Trạng thái vận chuyển" value={<Badge variant="secondary">{order.deliveryInfo?.status || 'Đã giao hàng'}</Badge>} />
            </div>
          </InfoCard>

          {/* 5 INSTALLATION (Only displayed if contains Equipment!) */}
          {containsEquipment && (
            <InfoCard title="5. Quy trình lắp đặt & Nghiệm thu KTV (Installation)" icon={<Wrench className="h-4 w-4 text-emerald-600" />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500">Kỹ thuật viên đảm nhận:</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{order.installationInfo?.technicianName || 'KTV Nguyễn Văn Đức'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Trạng thái nghiệm thu:</span>
                    <p className="mt-0.5 font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {order.installationInfo?.status || 'Đã bàn giao nghiệm thu'}
                    </p>
                  </div>
                </div>

                {/* 5-Step Technical Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Checklist kỹ thuật lắp đặt máy pha:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(order.installationInfo?.checklist || [
                      { title: 'Kiểm tra đường điện 220V/32A riêng biệt', completed: true },
                      { title: 'Lắp đặt bộ lọc nước máy Brita Purity C1100', completed: true },
                      { title: 'Đấu nối đường nước cấp & xả thải', completed: true },
                      { title: 'Cân chỉnh áp suất 9 bar & nhiệt độ boiler 93.5°C', completed: true },
                      { title: 'Hướng dẫn Barista backflush & vệ sinh họng pha', completed: true },
                    ]).map((chk, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                        {chk.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                        )}
                        <span className={chk.completed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}>{chk.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </InfoCard>
          )}

          {/* 6 INVOICE */}
          <InfoCard title="6. Thông tin hóa đơn điện tử (Invoice)" icon={<FileCheck className="h-4 w-4 text-purple-600" />}>
            <div className="space-y-1">
              <InfoRow label="Tên công ty xuất hóa đơn" value={order.invoiceInfo?.companyName || order.customerName} />
              <InfoRow label="Mã số thuế (MST)" value={order.invoiceInfo?.taxCode || '0312984511'} />
              <InfoRow label="Số hóa đơn điện tử" value={<span className="font-mono font-bold text-slate-900 dark:text-slate-100">{order.invoiceInfo?.invoiceNumber || 'HDDT-2026-00891'}</span>} />
              <InfoRow label="Ngày phát hành" value={<DateDisplay date={order.invoiceInfo?.issuedDate || order.orderDate} />} />
              <InfoRow label="Trạng thái HĐDT" value={<Badge variant="secondary" className="bg-emerald-100 text-emerald-800">{order.invoiceInfo?.status || 'ĐÃ PHÁT HÀNH'}</Badge>} />
            </div>
          </InfoCard>

          {/* 7 STATUS HISTORY */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span>7. Lịch sử trạng thái đơn hàng (Status History)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ActivityTimeline items={timelineItems} />
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Cols: Customer Info & Payment Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* 1 CUSTOMER INFORMATION */}
          <InfoCard title="1. Thông tin khách hàng" icon={<User className="h-4 w-4 text-slate-500" />}>
            <div className="space-y-3">
              <div>
                <Link to={`/customers/${order.customerId}`} className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-orange-600 transition-colors flex items-center gap-1.5">
                  {order.customerType === 'BUSINESS' ? <Building2 className="h-4 w-4 text-purple-600" /> : <User className="h-4 w-4 text-slate-500" />}
                  <span>{order.customerName}</span>
                </Link>
                <div className="mt-1">
                  <StatusBadge type="customerType" status={order.customerType} />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-mono font-semibold">{order.customerPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  <span>{order.shippingAddress}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>NVKD: <strong>{order.salespersonName}</strong></span>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* 3 PAYMENT */}
          <InfoCard title="3. Thông tin thanh toán (Payment)" icon={<CreditCard className="h-4 w-4 text-emerald-600" />}>
            <div className="space-y-3">
              <div className="space-y-1">
                <InfoRow label="Tiền hàng (Subtotal)" value={<MoneyDisplay amount={order.subtotal} size="sm" />} />
                <InfoRow label="Chiết khấu" value={<MoneyDisplay amount={order.discountAmount} size="sm" variant="muted" />} />
                <InfoRow label="Thuế VAT (10%)" value={<MoneyDisplay amount={order.taxAmount} size="sm" />} />
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <InfoRow label="Tổng cộng thanh toán" value={<MoneyDisplay amount={order.totalAmount} size="lg" variant="default" />} />
                </div>
                <InfoRow label="Đã thanh toán" value={<MoneyDisplay amount={order.paidAmount} size="sm" variant="success" />} />
                <InfoRow label="Công nợ còn lại" value={<MoneyDisplay amount={order.debtAmount} size="sm" variant={order.debtAmount > 0 ? 'destructive' : 'muted'} />} />
              </div>

              {/* Payment History Batches */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Lịch sử các đợt thanh toán:</h4>
                {(order.paymentHistory || [
                  { id: 'p-1', date: order.orderDate, amount: order.paidAmount, method: 'Chuyển khoản VietinBank', reference: 'FT2604699123' },
                ]).map((pay) => (
                  <div key={pay.id} className="p-2.5 rounded bg-slate-50 dark:bg-slate-900 text-xs space-y-1 border border-slate-100 dark:border-slate-800 mb-2">
                    <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{pay.method}</span>
                      <MoneyDisplay amount={pay.amount} size="sm" variant="success" />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Mã GD: {pay.reference}</span>
                      <span><DateDisplay date={pay.date} /></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </InfoCard>
        </div>
      </div>
    </PageContainer>
  );
};
