import React, { useEffect, useState } from 'react';
import { PageContainer } from '@/components/shared/PageContainer';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatCard } from '@/components/shared/StatCard';
import { DateRangeFilter } from '@/components/shared/DateRangeFilter';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { MoneyDisplay } from '@/components/shared/MoneyDisplay';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dashboardService } from '@/services/dashboardService';
import { DashboardSummary, OperationalAlert } from '@/types';
import { formatMoney, formatNumber } from '@/utils/format';
import {
  AlertTriangle,
  Clock,
  CreditCard,
  Wrench,
  ShieldAlert,
  ArrowUpRight,
  Package,
  Layers,
  ChevronRight,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('this_month');
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await dashboardService.getDashboardSummary(dateRange);
      setData(res);
    } catch (err) {
      setError('Không thể tải dữ liệu dashboard. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [dateRange]);

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          title="Tổng quan kinh doanh & Vận hành"
          description="Hệ thống CRM & ERP máy pha cà phê, hạt cà phê & linh kiện"
        />
        <LoadingState type="detail" />
      </PageContainer>
    );
  }

  if (error || !data) {
    return (
      <PageContainer>
        <PageHeader title="Tổng quan kinh doanh & Vận hành" />
        <ErrorState message={error || 'Có lỗi xảy ra'} onRetry={fetchDashboard} />
      </PageContainer>
    );
  }

  const { kpis, salesTrend, orderStatusCounts, topProducts, inventorySummary, operationalAlerts, afterSales } = data;

  const getAlertIcon = (category: OperationalAlert['category']) => {
    switch (category) {
      case 'inventory':
        return <Package className="h-4 w-4 text-amber-600" />;
      case 'order':
        return <Clock className="h-4 w-4 text-sky-600" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-rose-600" />;
      case 'installation':
        return <Wrench className="h-4 w-4 text-emerald-600" />;
      case 'warranty':
        return <ShieldAlert className="h-4 w-4 text-purple-600" />;
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-slate-500" />;
    }
  };

  const getSeverityBadge = (severity: OperationalAlert['severity']) => {
    switch (severity) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 dark:bg-rose-950 dark:text-rose-400">
            Cần xử lý gấp
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-400">
            Trung bình
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-400">
            Thông thường
          </span>
        );
    }
  };

  return (
    <PageContainer>
      {/* Top Page Header */}
      <PageHeader
        title="Tổng quan kinh doanh & Vận hành"
        description="Hệ thống quản trị bán hàng, tồn kho thiết bị và bảo hành hậu mãi VietY Coffee."
        badge={
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
            <Sparkles className="h-3 w-3" /> Live ERP
          </span>
        }
      >
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </PageHeader>

      {/* SECTION 1 — KPI CARDS */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Chỉ số kinh doanh trọng yếu (KPIs)
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Doanh thu"
            value={formatMoney(kpis.revenue.current)}
            trend={{
              value: kpis.revenue.changePercent,
              isPositive: kpis.revenue.changePercent > 0,
            }}
            description={kpis.revenue.compareText}
          />
          <StatCard
            title="Đơn hàng"
            value={formatNumber(kpis.orders.current)}
            trend={{
              value: kpis.orders.changePercent,
              isPositive: kpis.orders.changePercent > 0,
            }}
            description={kpis.orders.compareText}
          />
          <StatCard
            title="Khách hàng mới"
            value={formatNumber(kpis.newCustomers.current)}
            trend={{
              value: kpis.newCustomers.changePercent,
              isPositive: kpis.newCustomers.changePercent > 0,
            }}
            description={kpis.newCustomers.compareText}
          />
          <StatCard
            title="Giá trị đơn trung bình"
            value={formatMoney(kpis.averageOrderValue.current)}
            trend={{
              value: kpis.averageOrderValue.changePercent,
              isPositive: kpis.averageOrderValue.changePercent > 0,
            }}
            description={kpis.averageOrderValue.compareText}
          />
        </div>
      </section>

      {/* SECTION 2 — BUSINESS PERFORMANCE */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Revenue Chart */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart2 className="h-4 w-4 text-orange-600" />
                <span>Doanh thu & Xu hướng đơn hàng</span>
              </CardTitle>
              <p className="text-xs text-slate-500">Biểu đồ doanh thu 12 tháng gần nhất (VND)</p>
            </div>
            <Badge variant="outline" className="text-xs font-normal">
              Đơn vị: Triệu ₫
            </Badge>
          </CardHeader>
          <CardContent className="pt-4 pb-2">
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--brand, #e11d2a)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--brand, #e11d2a)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg shadow-xl text-xs space-y-1 border border-slate-700">
                            <p className="font-bold text-amber-400">{label}</p>
                            <p className="font-semibold">{formatMoney(d.revenue)}</p>
                            <p className="text-[11px] text-slate-300">{d.ordersCount} đơn hàng</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--brand, #e11d2a)"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-xs bg-brand inline-block" /> Xu hướng Doanh thu (Triệu ₫)
              </span>
              <span className="text-[11px] text-slate-400">Tự động cập nhật từ ERP</span>
            </div>
          </CardContent>
        </Card>

        {/* Right 5 cols: Order Status Distribution */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-sky-600" />
              <span>Phân bố trạng thái đơn hàng</span>
            </CardTitle>
            <p className="text-xs text-slate-500">Tỷ lệ đơn hàng theo quy trình xử lý</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: 'PENDING', label: 'Chờ xử lý', color: 'bg-amber-500' },
              { key: 'CONFIRMED', label: 'Đã xác nhận', color: 'bg-sky-500' },
              { key: 'PROCESSING', label: 'Đang chuẩn bị hàng', color: 'bg-purple-500' },
              { key: 'SHIPPED', label: 'Đang giao hàng', color: 'bg-indigo-500' },
              { key: 'COMPLETED', label: 'Hoàn tất', color: 'bg-emerald-500' },
              { key: 'CANCELLED', label: 'Đã hủy', color: 'bg-rose-500' },
            ].map((st) => {
              const count = orderStatusCounts[st.key] || 0;
              const total = Object.values(orderStatusCounts).reduce((a, b) => a + b, 0) || 1;
              const percent = Math.round((count / total) * 100);

              return (
                <div key={st.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <StatusBadge type="order" status={st.key} />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {count} đơn ({percent}%)
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${st.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      {/* SECTION 3 — PRODUCTS & INVENTORY */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 cols: Top Selling Products */}
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-600" />
                <span>Top sản phẩm bán chạy</span>
              </CardTitle>
              <p className="text-xs text-slate-500">Thiết bị máy pha, máy xay và hạt cà phê doanh thu cao nhất</p>
            </div>
            <Link to="/products">
              <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-900 gap-1">
                <span>Xem tất cả</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-y border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Sản phẩm</th>
                  <th className="py-2.5 px-4 font-semibold">Phân loại</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Đã bán</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 max-w-[220px] truncate">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{p.code}</div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge type="productType" status={p.type} />
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-700 dark:text-slate-300">
                      {formatNumber(p.unitsSold)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <MoneyDisplay amount={p.totalRevenue} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Right 5 cols: Inventory Status */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              <span>Tình trạng tồn kho</span>
            </CardTitle>
            <p className="text-xs text-slate-500">Phân bổ tồn kho thực tế và mức cảnh báo an toàn</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-[11px] text-slate-500">Tổng mặt hàng</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {inventorySummary.totalItems} mã
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Tồn kho thấp</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {inventorySummary.lowStockCount} mặt hàng
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-sky-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Thiết bị máy pha / máy xay</span>
                </div>
                <span className="font-bold">{inventorySummary.equipmentsCount} mã máy</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-md border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Hạt cà phê & Vật tư hóa chất</span>
                </div>
                <span className="font-bold">{inventorySummary.consumablesCount} mã vật tư</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/inventory" className="w-full">
                <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                  <span>Quản lý kho hàng chi tiết</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 4 — CẦN CHÚ Ý (Operational Actionable Alerts) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Cảnh báo vận hành cần chú ý</span>
            </h2>
            <p className="text-xs text-slate-500">Các phát sinh nghiệp vụ cần ban quản lý và các phòng ban xử lý ngay</p>
          </div>
          <Badge variant="destructive" className="text-xs">
            {operationalAlerts.length} Cảnh báo
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operationalAlerts.map((alt) => (
            <Card key={alt.id} className="p-4 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                      {getAlertIcon(alt.category)}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      {alt.title}
                    </h3>
                  </div>
                  {getSeverityBadge(alt.severity)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {alt.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {alt.count ? `SL: ${alt.count}` : ''}
                </span>
                <Link to={alt.ctaHref}>
                  <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40 p-0 px-2 gap-1">
                    <span>{alt.ctaText}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SECTION 5 — AFTER SALES (Hậu Mãi Kỹ Thuật) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Kỹ thuật & Hậu mãi máy pha cà phê
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/installations">
            <StatCard
              title="Máy chờ lắp đặt"
              value={formatNumber(afterSales.pendingInstallations)}
              description="Đã giao hàng, chờ xếp lịch KTV"
              icon={Wrench}
              iconColor="text-emerald-700 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
            />
          </Link>
          <Link to="/warranties">
            <StatCard
              title="Đang bảo hành"
              value={formatNumber(afterSales.activeWarranties)}
              description="Sổ bảo hành chính hãng có hiệu lực"
              icon={CheckCircle2}
              iconColor="text-purple-700 bg-purple-50 dark:bg-purple-950 dark:text-purple-400"
            />
          </Link>
          <Link to="/maintenance">
            <StatCard
              title="Bảo trì sắp tới"
              value={formatNumber(afterSales.upcomingMaintenances)}
              description="Lịch vệ sinh & thay phụ kiện 3 tháng"
              icon={Clock}
              iconColor="text-amber-700 bg-amber-50 dark:bg-amber-950 dark:text-amber-400"
            />
          </Link>
          <Link to="/tickets">
            <StatCard
              title="Ticket chưa xử lý"
              value={formatNumber(afterSales.unresolvedTickets)}
              description="Yêu cầu hỗ trợ kỹ thuật từ khách hàng"
              icon={AlertTriangle}
              iconColor="text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-400"
            />
          </Link>
        </div>
      </section>
    </PageContainer>
  );
};
