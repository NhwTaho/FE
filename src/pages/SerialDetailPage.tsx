import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '@/components/shared/PageContainer';
import { DetailHeader } from '@/components/shared/DetailHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { DateDisplay } from '@/components/shared/DateDisplay';
import { InfoCard, InfoRow } from '@/components/shared/InfoCard';
import { ActivityTimeline, TimelineItem } from '@/components/shared/ActivityTimeline';
import { LifecycleTimeline } from '@/components/shared/LifecycleTimeline';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { serialService } from '@/services/serialService';
import { MachineSerial } from '@/types';
import {
  Cpu,
  Warehouse,
  ShoppingCart,
  User,
  Phone,
  MapPin,
  Building2,
  FileText,
  Wrench,
  ShieldCheck,
  Clock,
  Printer,
  CheckCircle2,
  History,
} from 'lucide-react';

export const SerialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [serial, setSerial] = useState<MachineSerial | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSerial = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await serialService.getSerialById(id);
      if (data) {
        setSerial(data);
      }
    } catch (err) {
      console.error('Lỗi khi tải thông tin Serial:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSerial();
  }, [id]);

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState type="detail" />
      </PageContainer>
    );
  }

  if (!serial) {
    return (
      <PageContainer>
        <ErrorState
          title="Không tìm thấy Serial thiết bị"
          message="Mã Serial này không tồn tại trong hệ thống quản lý kho."
          onRetry={() => navigate('/serials')}
        />
      </PageContainer>
    );
  }

  const timelineItems: TimelineItem[] = (serial.history || []).map((h) => ({
    id: h.id,
    date: h.date,
    action: h.action,
    performedBy: h.performedBy,
    notes: h.notes,
    type: 'status',
  }));

  return (
    <PageContainer>
      {/* Header: Product name, Model, Serial, StatusBadge */}
      <DetailHeader
        title={`Serial: ${serial.serialNumber}`}
        subtitle={`${serial.productName} • Model: ${serial.model || serial.brand} • Năm SX: ${serial.manufactureYear || '2025'}`}
        backUrl="/serials"
        badge={
          <div className="flex items-center gap-2">
            <StatusBadge type="serial" status={serial.status} />
          </div>
        }
      >
        <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" />
          <span>In thẻ Serial</span>
        </Button>
      </DetailHeader>

      {/* SECTION 9 — LIFECYCLE TIMELINE STEPPER (at the top for prominent visual tracking) */}
      <LifecycleTimeline
        status={serial.status}
        stockDate={serial.stockEntryDate || serial.createdAt}
        reserveDate={serial.status !== 'IN_STOCK' ? serial.createdAt : undefined}
        saleDate={serial.saleDate}
        deliveryDate={serial.saleDate}
        installationDate={serial.installationCompletedDate || serial.installationScheduledDate}
        handoverDate={serial.installationCompletedDate}
        warrantyEndDate={serial.warrantyEndDate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left 8 Cols: Equipment Info, Order, Installation, Warranty, Maintenance History */}
        <div className="lg:col-span-8 space-y-6">
          {/* SECTION 1 — THÔNG TIN THIẾT BỊ */}
          <InfoCard title="1. Thông tin thiết bị (Equipment Specs)" icon={<Cpu className="h-4 w-4 text-purple-600" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 space-y-1">
              <InfoRow label="Số Serial (S/N)" value={<span className="font-mono font-bold text-slate-900 dark:text-slate-100">{serial.serialNumber}</span>} />
              <InfoRow label="Mã sản phẩm" value={<span className="font-mono text-slate-600">{serial.productCode}</span>} />
              <InfoRow label="Tên máy" value={serial.productName} />
              <InfoRow label="Model / Thương hiệu" value={`${serial.model || serial.brand} (${serial.brand})`} />
              <InfoRow label="Xuất xứ" value={serial.origin || 'Ý (Italy)'} />
              <InfoRow label="Năm sản xuất" value={serial.manufactureYear ? `${serial.manufactureYear}` : '2025'} />
              {serial.notes && <InfoRow label="Ghi chú thiết bị" value={serial.notes} />}
            </div>
          </InfoCard>

          {/* SECTION 5 — ĐƠN HÀNG */}
          <InfoCard title="5. Thông tin đơn hàng (Order Reference)" icon={<FileText className="h-4 w-4 text-sky-600" />}>
            {serial.orderNumber ? (
              <div className="space-y-2 text-xs">
                <InfoRow
                  label="Mã đơn hàng"
                  value={
                    serial.orderId ? (
                      <Link to={`/orders/${serial.orderId}`} className="font-mono font-bold text-orange-600 hover:underline">
                        #{serial.orderNumber}
                      </Link>
                    ) : (
                      <span className="font-mono font-bold text-slate-900">{serial.orderNumber}</span>
                    )
                  }
                />
                {serial.orderStatus && (
                  <InfoRow label="Trạng thái đơn" value={<StatusBadge type="order" status={serial.orderStatus} />} />
                )}
                {serial.orderTotalAmount && (
                  <InfoRow label="Tổng giá trị đơn" value={<MoneyDisplay amount={serial.orderTotalAmount} size="sm" />} />
                )}
                {serial.orderPaymentStatus && (
                  <InfoRow label="Thanh toán" value={<StatusBadge type="payment" status={serial.orderPaymentStatus} />} />
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Thiết bị chưa gán cho đơn hàng nào (Đang trong kho lưu trữ).</p>
            )}
          </InfoCard>

          {/* SECTION 6 — LẮP ĐẶT */}
          <InfoCard title="6. Quy trình lắp đặt (Installation)" icon={<Wrench className="h-4 w-4 text-emerald-600" />}>
            {serial.technicianName || serial.installationStatus ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500">Kỹ thuật viên phụ trách:</span>
                    <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{serial.technicianName || 'KTV Nguyễn Văn Đức'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Trạng thái lắp đặt:</span>
                    <div className="mt-0.5">
                      <StatusBadge type="installation" status={serial.installationStatus || 'COMPLETED'} />
                    </div>
                  </div>
                  {serial.installationScheduledDate && (
                    <div>
                      <span className="text-slate-500">Ngày xếp lịch:</span>
                      <p className="font-semibold text-slate-800 mt-0.5"><DateDisplay date={serial.installationScheduledDate} /></p>
                    </div>
                  )}
                  {serial.installationCompletedDate && (
                    <div>
                      <span className="text-slate-500">Ngày bàn giao thành công:</span>
                      <p className="font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <DateDisplay date={serial.installationCompletedDate} />
                      </p>
                    </div>
                  )}
                </div>

                {/* Technical Checklist */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Checklist kỹ thuật kiểm định:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(serial.installationChecklist || [
                      { title: 'Kiểm tra đường điện 220V/32A riêng biệt', completed: true },
                      { title: 'Lắp đặt hệ thống lọc nước Brita Purity C1100', completed: true },
                      { title: 'Đấu nối dây cấp nước & đường xả thải', completed: true },
                      { title: 'Cân chỉnh áp suất 9 bar & nhiệt độ boiler 93.5°C', completed: true },
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
            ) : (
              <p className="text-xs text-slate-400 italic">Thiết bị chưa bước vào quy trình lắp đặt tận nơi.</p>
            )}
          </InfoCard>

          {/* SECTION 7 — BẢO HÀNH */}
          <InfoCard title="7. Sổ bảo hành chính hãng (Warranty)" icon={<ShieldCheck className="h-4 w-4 text-purple-600" />}>
            {serial.warrantyEndDate || serial.warrantyCode ? (
              <div className="space-y-1 text-xs">
                <InfoRow label="Mã phiếu bảo hành" value={<span className="font-mono font-bold text-purple-700 dark:text-purple-400">{serial.warrantyCode || 'BH-2026-001'}</span>} />
                <InfoRow label="Gói bảo hành" value={<Badge variant="secondary" className="bg-purple-100 text-purple-800">{serial.warrantyType || 'PREMIUM (12 Tháng)'}</Badge>} />
                <InfoRow label="Ngày bắt đầu BH" value={<DateDisplay date={serial.warrantyStartDate || serial.installationCompletedDate || serial.saleDate} />} />
                <InfoRow label="Ngày hết hạn BH" value={<DateDisplay date={serial.warrantyEndDate} />} />
                <InfoRow label="Trạng thái hiệu lực" value={<StatusBadge type="warranty" status={serial.warrantyStatus || 'ACTIVE'} />} />
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa kích hoạt sổ bảo hành (Chỉ kích hoạt sau khi lắp đặt & bàn giao thành công).</p>
            )}
          </InfoCard>

          {/* SECTION 8 — BẢO TRÌ / SỬA CHỮA */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Wrench className="h-4 w-4 text-amber-600" />
                <span>8. Lịch sử bảo trì & sửa chữa (Maintenance & Repair History)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {serial.maintenanceHistory && serial.maintenanceHistory.length > 0 ? (
                <div className="space-y-3">
                  {serial.maintenanceHistory.map((m) => (
                    <div key={m.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={m.type === 'REPAIR' ? 'border-rose-300 text-rose-700' : 'border-emerald-300 text-emerald-700'}>
                            {m.type === 'REPAIR' ? 'Sửa chữa' : 'Bảo trì định kỳ'}
                          </Badge>
                          <span className="font-bold text-slate-900 dark:text-slate-100">{m.summary}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span>KTV: <strong>{m.technicianName}</strong></span>
                          <span>•</span>
                          <DateDisplay date={m.date} />
                        </div>
                      </div>

                      {m.replacedParts && m.replacedParts.length > 0 && (
                        <div className="text-[11px] text-slate-600 dark:text-slate-400">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Linh kiện thay thế: </span>
                          {m.replacedParts.join(', ')}
                        </div>
                      )}

                      {m.cost !== undefined && (
                        <div className="flex justify-between items-center text-[11px] pt-1">
                          <span className="text-slate-400">Chi phí dịch vụ:</span>
                          <MoneyDisplay amount={m.cost} size="sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có lịch sử bảo trì hoặc sửa chữa lớn phát sinh.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 4 Cols: Warehouse Info, Sales Info, Owner Customer */}
        <div className="lg:col-span-4 space-y-6">
          {/* SECTION 2 — THÔNG TIN KHO */}
          <InfoCard title="2. Thông tin kho lưu trữ" icon={<Warehouse className="h-4 w-4 text-slate-500" />}>
            <div className="space-y-1 text-xs">
              <InfoRow label="Tên kho hiện tại" value={<span className="font-bold text-slate-900 dark:text-slate-100">{serial.warehouseName}</span>} />
              <InfoRow label="Địa chỉ kho" value={serial.warehouseAddress || 'Tân Bình, TP.HCM'} />
              <InfoRow label="Thủ kho quản lý" value={serial.warehouseManager || 'Trần Văn Tiến'} />
              <InfoRow label="Ngày nhập kho" value={<DateDisplay date={serial.stockEntryDate || serial.createdAt} />} />
            </div>
          </InfoCard>

          {/* SECTION 3 — THÔNG TIN BÁN HÀNG */}
          <InfoCard title="3. Thông tin xuất bán" icon={<ShoppingCart className="h-4 w-4 text-emerald-600" />}>
            {serial.saleDate ? (
              <div className="space-y-1 text-xs">
                <InfoRow label="Ngày xuất bán" value={<DateDisplay date={serial.saleDate} />} />
                <InfoRow label="Kênh bán" value={<StatusBadge type="salesChannel" status={serial.salesChannel || 'DIRECT_SALES'} showDot={false} />} />
                <InfoRow label="Nhân viên kinh doanh" value={serial.salespersonName || 'Lê Hoàng Nam'} />
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Thiết bị chưa được xuất bán.</p>
            )}
          </InfoCard>

          {/* SECTION 4 — KHÁCH HÀNG SỞ HỮU */}
          <InfoCard title="4. Khách hàng sở hữu" icon={<User className="h-4 w-4 text-slate-500" />}>
            {serial.customerId && serial.customerName ? (
              <div className="space-y-3">
                <div>
                  <Link to={`/customers/${serial.customerId}`} className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-orange-600 transition-colors flex items-center gap-1.5">
                    {serial.customerType === 'BUSINESS' ? <Building2 className="h-4 w-4 text-purple-600" /> : <User className="h-4 w-4 text-slate-500" />}
                    <span>{serial.customerName}</span>
                  </Link>
                  <div className="mt-1">
                    <StatusBadge type="customerType" status={serial.customerType || 'BUSINESS'} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                  {serial.customerPhone && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-mono font-semibold">{serial.customerPhone}</span>
                    </div>
                  )}
                  {serial.installationAddress && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{serial.installationAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa thuộc sở hữu của khách hàng nào (Đang tồn kho).</p>
            )}
          </InfoCard>

          {/* SECTION HISTORY / TIMELINE LIST */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <History className="h-4 w-4 text-slate-500" />
                <span>Nhật ký chuyển trạng thái Serial</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ActivityTimeline items={timelineItems} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};
