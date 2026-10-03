// ==========================================
// Status Badge Mapping System (Unified Tokens)
// ==========================================

export type StatusTone = 'success' | 'warning' | 'destructive' | 'info' | 'neutral' | 'purple';

export interface StatusConfig {
  label: string;
  tone: StatusTone;
  badgeClass: string;
}

const TONE_CLASSES: Record<StatusTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  warning: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  destructive: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
  info: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
};

// Customer Status
export const CUSTOMER_STATUS_MAP: Record<string, StatusConfig> = {
  ACTIVE: { label: 'Đang hoạt động', tone: 'success', badgeClass: TONE_CLASSES.success },
  INACTIVE: { label: 'Tạm dừng', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
  LEAD: { label: 'Tiềm năng', tone: 'info', badgeClass: TONE_CLASSES.info },
};

// Customer Type
export const CUSTOMER_TYPE_MAP: Record<string, StatusConfig> = {
  PERSONAL: { label: 'Cá nhân', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
  BUSINESS: { label: 'Doanh nghiệp', tone: 'purple', badgeClass: TONE_CLASSES.purple },
};

// Product Type
export const PRODUCT_TYPE_MAP: Record<string, StatusConfig> = {
  EQUIPMENT: { label: 'Thiết bị (Máy)', tone: 'info', badgeClass: TONE_CLASSES.info },
  CONSUMABLE: { label: 'Vật tư / Nguyên liệu', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  ACCESSORY: { label: 'Phụ kiện', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
  SPARE_PART: { label: 'Linh kiện thay thế', tone: 'purple', badgeClass: TONE_CLASSES.purple },
};

// Order Status
export const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: { label: 'Mới', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  CONFIRMED: { label: 'Xác nhận', tone: 'info', badgeClass: TONE_CLASSES.info },
  PROCESSING: { label: 'Đang chuẩn bị', tone: 'purple', badgeClass: TONE_CLASSES.purple },
  SHIPPED: { label: 'Đang giao', tone: 'info', badgeClass: TONE_CLASSES.info },
  AWAITING_INSTALLATION: { label: 'Chờ lắp đặt', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  COMPLETED: { label: 'Hoàn tất', tone: 'success', badgeClass: TONE_CLASSES.success },
  CANCELLED: { label: 'Hủy', tone: 'destructive', badgeClass: TONE_CLASSES.destructive },
  REFUNDED: { label: 'Đã hoàn tiền', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
};

// Sales Channel
export const SALES_CHANNEL_MAP: Record<string, StatusConfig> = {
  SHOWROOM: { label: 'Showroom', tone: 'info', badgeClass: TONE_CLASSES.info },
  DIRECT_SALES: { label: 'Sales trực tiếp', tone: 'purple', badgeClass: TONE_CLASSES.purple },
  WEBSITE: { label: 'Website', tone: 'success', badgeClass: TONE_CLASSES.success },
  PARTNER: { label: 'Đối tác', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
};

// Payment Status
export const PAYMENT_STATUS_MAP: Record<string, StatusConfig> = {
  UNPAID: { label: 'Chưa thanh toán', tone: 'destructive', badgeClass: TONE_CLASSES.destructive },
  PARTIAL: { label: 'Thanh toán 1 phần', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  PAID: { label: 'Đã thanh toán', tone: 'success', badgeClass: TONE_CLASSES.success },
  REFUNDED: { label: 'Đã hoàn tiền', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
};

// Machine Serial Status
export const SERIAL_STATUS_MAP: Record<string, StatusConfig> = {
  IN_STOCK: { label: 'Trong kho', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
  RESERVED: { label: 'Giữ hàng', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  SOLD: { label: 'Đã bán', tone: 'info', badgeClass: TONE_CLASSES.info },
  DELIVERED: { label: 'Đã giao hàng', tone: 'info', badgeClass: TONE_CLASSES.info },
  WAITING_INSTALLATION: { label: 'Chờ lắp đặt', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  INSTALLED: { label: 'Đã lắp đặt', tone: 'success', badgeClass: TONE_CLASSES.success },
  UNDER_WARRANTY: { label: 'Đang bảo hành', tone: 'purple', badgeClass: TONE_CLASSES.purple },
  IN_WARRANTY: { label: 'Đang bảo hành', tone: 'purple', badgeClass: TONE_CLASSES.purple },
  UNDER_REPAIR: { label: 'Đang sửa chữa', tone: 'destructive', badgeClass: TONE_CLASSES.destructive },
  IN_REPAIR: { label: 'Đang sửa chữa', tone: 'destructive', badgeClass: TONE_CLASSES.destructive },
  MAINTENANCE: { label: 'Đang bảo trì', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  RETIRED: { label: 'Ngừng sử dụng', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
};

// Installation Status
export const INSTALLATION_STATUS_MAP: Record<string, StatusConfig> = {
  PENDING: { label: 'Chờ phân công', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  SCHEDULED: { label: 'Đã xếp lịch', tone: 'info', badgeClass: TONE_CLASSES.info },
  IN_PROGRESS: { label: 'Đang tiến hành', tone: 'purple', badgeClass: TONE_CLASSES.purple },
  COMPLETED: { label: 'Đã bàn giao', tone: 'success', badgeClass: TONE_CLASSES.success },
  FAILED: { label: 'Lắp đặt thất bại', tone: 'destructive', badgeClass: TONE_CLASSES.destructive },
  CANCELLED: { label: 'Hủy lịch', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
};

// Warranty Status
export const WARRANTY_STATUS_MAP: Record<string, StatusConfig> = {
  ACTIVE: { label: 'Còn hiệu lực', tone: 'success', badgeClass: TONE_CLASSES.success },
  EXPIRING_SOON: { label: 'Sắp hết hạn', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  EXPIRED: { label: 'Hết hạn', tone: 'neutral', badgeClass: TONE_CLASSES.neutral },
  VOID: { label: 'Mất hiệu lực', tone: 'destructive', badgeClass: TONE_CLASSES.destructive },
};

// Inventory Stock Status
export const INVENTORY_STATUS_MAP: Record<string, StatusConfig> = {
  NORMAL: { label: 'Đủ hàng', tone: 'success', badgeClass: TONE_CLASSES.success },
  LOW_STOCK: { label: 'Sắp hết hàng', tone: 'warning', badgeClass: TONE_CLASSES.warning },
  OUT_OF_STOCK: { label: 'Hết hàng', tone: 'destructive', badgeClass: TONE_CLASSES.destructive },
};

// Generic status retriever fallback helper
export function getStatusConfig(type: string, statusKey: string): StatusConfig {
  const mapDict: Record<string, Record<string, StatusConfig>> = {
    customer: CUSTOMER_STATUS_MAP,
    customerType: CUSTOMER_TYPE_MAP,
    productType: PRODUCT_TYPE_MAP,
    order: ORDER_STATUS_MAP,
    payment: PAYMENT_STATUS_MAP,
    serial: SERIAL_STATUS_MAP,
    installation: INSTALLATION_STATUS_MAP,
    warranty: WARRANTY_STATUS_MAP,
    inventory: INVENTORY_STATUS_MAP,
    salesChannel: SALES_CHANNEL_MAP,
  };

  const selectedMap = mapDict[type];
  if (selectedMap && selectedMap[statusKey]) {
    return selectedMap[statusKey];
  }

  return {
    label: statusKey,
    tone: 'neutral',
    badgeClass: TONE_CLASSES.neutral,
  };
}
