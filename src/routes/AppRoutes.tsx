import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';

// MVP Pages
import { DashboardPage } from '@/pages/DashboardPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { CustomerDetailPage } from '@/pages/CustomerDetailPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { SerialsPage } from '@/pages/SerialsPage';
import { SerialDetailPage } from '@/pages/SerialDetailPage';
import { InstallationsPage } from '@/pages/InstallationsPage';
import { WarrantiesPage } from '@/pages/WarrantiesPage';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppShell />}>
        {/* MVP Routes */}
        <Route index element={<DashboardPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrderDetailPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="serials" element={<SerialsPage />} />
        <Route path="serials/:id" element={<SerialDetailPage />} />
        <Route path="installations" element={<InstallationsPage />} />
        <Route path="warranties" element={<WarrantiesPage />} />

        {/* Future / Non-MVP Placeholder Routes */}
        <Route path="leads" element={<PlaceholderPage title="Khách hàng tiềm năng" />} />
        <Route path="opportunities" element={<PlaceholderPage title="Cơ hội bán hàng" />} />
        <Route path="quotes" element={<PlaceholderPage title="Báo giá" />} />
        <Route path="returns" element={<PlaceholderPage title="Đổi trả / Hoàn tiền" />} />
        <Route path="categories" element={<PlaceholderPage title="Danh mục sản phẩm" />} />
        <Route path="price-lists" element={<PlaceholderPage title="Bảng giá" />} />
        <Route path="stock-movements" element={<PlaceholderPage title="Nhập / Xuất kho" />} />
        <Route path="stocktaking" element={<PlaceholderPage title="Kiểm kho" />} />
        <Route path="suppliers" element={<PlaceholderPage title="Nhà cung cấp" />} />
        <Route path="purchase-orders" element={<PlaceholderPage title="Đơn mua hàng" />} />
        <Route path="goods-receipts" element={<PlaceholderPage title="Nhập hàng" />} />
        <Route path="maintenance" element={<PlaceholderPage title="Bảo trì thiết bị" />} />
        <Route path="tickets" element={<PlaceholderPage title="Ticket hỗ trợ" />} />
        <Route path="cashflow" element={<PlaceholderPage title="Thu / Chi tài chính" />} />
        <Route path="debts" element={<PlaceholderPage title="Quản lý công nợ" />} />
        <Route path="invoices" element={<PlaceholderPage title="Hóa đơn" />} />
        <Route path="reports" element={<PlaceholderPage title="Báo cáo quản trị" />} />
        <Route path="users" element={<PlaceholderPage title="Quản lý người dùng" />} />
        <Route path="roles" element={<PlaceholderPage title="Phân quyền hệ thống" />} />
        <Route path="settings" element={<PlaceholderPage title="Cấu hình hệ thống" />} />
        <Route path="audit-logs" element={<PlaceholderPage title="Nhật ký hoạt động" />} />

        {/* Catch-all redirect to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
