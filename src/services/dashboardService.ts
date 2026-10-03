import { DashboardSummary } from '@/types';
import {
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
  MOCK_INSTALLATIONS,
  MOCK_WARRANTIES,
} from '@/data/mocks';

export const dashboardService = {
  async getDashboardSummary(_period: string = 'this_month'): Promise<DashboardSummary> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate totals dynamically from mocks
        const totalRevenue = MOCK_ORDERS.reduce((acc, o) => acc + o.totalAmount, 0);
        const totalOrdersCount = MOCK_ORDERS.length;
        const totalCustomersCount = MOCK_CUSTOMERS.length;
        const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

        const orderStatusCounts: Record<string, number> = {
          PENDING: 0,
          CONFIRMED: 0,
          PROCESSING: 0,
          SHIPPED: 0,
          COMPLETED: 0,
          CANCELLED: 0,
        };

        MOCK_ORDERS.forEach((o) => {
          if (orderStatusCounts[o.status] !== undefined) {
            orderStatusCounts[o.status] += 1;
          } else {
            orderStatusCounts[o.status] = 1;
          }
        });

        // Top selling products based on mock items
        const topProducts = [
          {
            id: 'prod-1',
            code: 'SP-LM-LINEA2G',
            name: 'Máy pha cà phê La Marzocco Linea Classic S 2 Group',
            type: 'EQUIPMENT' as const,
            unitsSold: 3,
            totalRevenue: 705000000,
          },
          {
            id: 'prod-2',
            code: 'SP-NS-APPIA2G',
            name: 'Máy pha cà phê Nuova Simonelli Appia Life 2 Group',
            type: 'EQUIPMENT' as const,
            unitsSold: 5,
            totalRevenue: 550000000,
          },
          {
            id: 'prod-3',
            code: 'SP-MK-E65S',
            name: 'Máy xay cà phê Mahlkönig E65S Espresso Grinder',
            type: 'EQUIPMENT' as const,
            unitsSold: 6,
            totalRevenue: 318000000,
          },
          {
            id: 'prod-4',
            code: 'SP-BEAN-CAUDAT-1KG',
            name: 'Hạt Cà phê Specialty Arabica Cầu Đất (Bao 1kg)',
            type: 'CONSUMABLE' as const,
            unitsSold: 320,
            totalRevenue: 134400000,
          },
          {
            id: 'prod-5',
            code: 'SP-CLEAN-URNEX-TAB',
            name: 'Viên tẩy rửa họng pha Urnex Cafiza Tablets (Hộp 100 viên)',
            type: 'CONSUMABLE' as const,
            unitsSold: 85,
            totalRevenue: 55250000,
          },
        ];

        // Monthly sales trend data (12 months overview)
        const salesTrend = [
          { month: 'T10/25', revenue: 420000000, ordersCount: 8 },
          { month: 'T11/25', revenue: 480000000, ordersCount: 10 },
          { month: 'T12/25', revenue: 650000000, ordersCount: 14 },
          { month: 'T01/26', revenue: 590000000, ordersCount: 12 },
          { month: 'T02/26', revenue: 316800000, ordersCount: 7 },
          { month: 'T03/26', revenue: 450000000, ordersCount: 9 },
          { month: 'T04/26', revenue: 520000000, ordersCount: 11 },
          { month: 'T05/26', revenue: 610000000, ordersCount: 13 },
          { month: 'T06/26', revenue: 580000000, ordersCount: 12 },
          { month: 'T07/26', revenue: 690000000, ordersCount: 15 },
          { month: 'T08/26', revenue: 730000000, ordersCount: 16 },
          { month: 'T09/26', revenue: 780000000, ordersCount: 18 },
        ];

        // Calculate operational alerts required by Section 4
        const operationalAlerts = [
          {
            id: 'alt-1',
            category: 'inventory' as const,
            title: 'Sản phẩm sắp hết hàng trong kho',
            description: 'Vật tư Urnex Cafiza & Hạt Arabica Cầu Đất dưới ngưỡng tồn an toàn (dưới 50 đơn vị).',
            severity: 'high' as const,
            count: 2,
            ctaText: 'Kiểm tra kho',
            ctaHref: '/inventory',
          },
          {
            id: 'alt-2',
            category: 'order' as const,
            title: 'Đơn hàng chưa xử lý quá 24h',
            description: 'Đơn hàng #DH-2026-003 của KH Trần Hoàng Bảo chưa phân công nhân viên xử lý.',
            severity: 'medium' as const,
            count: 1,
            ctaText: 'Xem đơn hàng',
            ctaHref: '/orders',
          },
          {
            id: 'alt-3',
            category: 'payment' as const,
            title: 'Công nợ quá hạn thanh toán',
            description: 'Công ty Passio Coffee còn dư nợ 35.000.000 ₫ quá hạn đợt 2 theo hợp đồng.',
            severity: 'high' as const,
            count: 1,
            ctaText: 'Quản lý công nợ',
            ctaHref: '/debts',
          },
          {
            id: 'alt-4',
            category: 'installation' as const,
            title: 'Máy pha chờ lắp đặt tận nơi',
            description: 'Đơn #DH-2026-002 cho The Workshop đã giao hàng, đang chờ kỹ thuật xếp lịch.',
            severity: 'medium' as const,
            count: 1,
            ctaText: 'Xếp lịch lắp đặt',
            ctaHref: '/installations',
          },
          {
            id: 'alt-5',
            category: 'warranty' as const,
            title: 'Sổ bảo hành sắp hết hạn',
            description: 'Máy Nuova Simonelli #NS-2025-1042 của The Workshop hết hạn trong 10 ngày tới.',
            severity: 'low' as const,
            count: 1,
            ctaText: 'Gia hạn bảo hành',
            ctaHref: '/warranties',
          },
          {
            id: 'alt-6',
            category: 'maintenance' as const,
            title: 'Lịch bảo trì định kỳ 3 tháng',
            description: 'Máy La Marzocco #LM-2026-8891 tại Passio Q.1 tới hạn bảo dưỡng thay ron họng pha.',
            severity: 'medium' as const,
            count: 2,
            ctaText: 'Xem lịch bảo trì',
            ctaHref: '/maintenance',
          },
        ];

        resolve({
          kpis: {
            revenue: {
              current: totalRevenue,
              changePercent: 14.8,
              compareText: 'so với tháng trước',
            },
            orders: {
              current: totalOrdersCount,
              changePercent: 8.2,
              compareText: 'so với tháng trước',
            },
            newCustomers: {
              current: totalCustomersCount,
              changePercent: 25.0,
              compareText: 'so với tháng trước',
            },
            averageOrderValue: {
              current: avgOrderValue,
              changePercent: 5.4,
              compareText: 'so với tháng trước',
            },
          },
          salesTrend,
          orderStatusCounts,
          topProducts,
          inventorySummary: {
            totalItems: MOCK_PRODUCTS.length,
            equipmentsCount: MOCK_PRODUCTS.filter((p) => p.type === 'EQUIPMENT').length,
            consumablesCount: MOCK_PRODUCTS.filter((p) => p.type === 'CONSUMABLE').length,
            lowStockCount: 1,
            outOfStockCount: 0,
          },
          operationalAlerts,
          afterSales: {
            pendingInstallations: MOCK_INSTALLATIONS.filter((i) => i.status === 'SCHEDULED' || i.status === 'PENDING').length,
            activeWarranties: MOCK_WARRANTIES.filter((w) => w.status === 'ACTIVE' || w.status === 'EXPIRING_SOON').length,
            upcomingMaintenances: 3,
            unresolvedTickets: 2,
          },
        });
      }, 250);
    });
  },
};
