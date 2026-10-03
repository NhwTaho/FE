// ==========================================
// VietY Coffee Machine CRM & ERP Domain Models
// ==========================================

export type CustomerType = 'PERSONAL' | 'BUSINESS';

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'LEAD';

export interface CustomerLocation {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  machinesCount: number;
}

export interface CustomerNote {
  id: string;
  date: string;
  author: string;
  text: string;
}

export interface CustomerTask {
  id: string;
  title: string;
  dueDate: string;
  status: 'PENDING' | 'DONE';
  assignedTo: string;
}

export interface CustomerInteraction {
  id: string;
  date: string;
  type: 'CALL' | 'MEETING' | 'EMAIL' | 'MAINTENANCE' | 'INSTALLATION';
  summary: string;
  performedBy: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  type: CustomerType;
  email: string;
  phone: string;
  address: string;
  taxCode?: string;
  companyName?: string;
  assignedStaff?: string;
  status: CustomerStatus;
  totalOrders: number;
  totalSpent: number;
  debtAmount: number;
  machinesCount: number;
  locations?: CustomerLocation[];
  notes?: CustomerNote[];
  tasks?: CustomerTask[];
  interactions?: CustomerInteraction[];
  createdAt: string;
  updatedAt: string;
}

export type ProductType = 'EQUIPMENT' | 'CONSUMABLE' | 'ACCESSORY' | 'SPARE_PART';

export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';

export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  type: ProductType;
  brand: string;
  origin?: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minStockThreshold: number;
  unit: string;
  description?: string;
  status: ProductStatus;
  hasSerial: boolean;
  activeSerialsCount?: number;
  createdAt: string;
}

export type MachineSerialStatus =
  | 'IN_STOCK'
  | 'RESERVED'
  | 'SOLD'
  | 'DELIVERED'
  | 'WAITING_INSTALLATION'
  | 'INSTALLED'
  | 'UNDER_WARRANTY'
  | 'UNDER_REPAIR'
  | 'MAINTENANCE'
  | 'RETIRED';

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'PREVENTIVE' | 'REPAIR' | 'PARTS_REPLACEMENT';
  technicianName: string;
  summary: string;
  replacedParts?: string[];
  cost?: number;
  notes?: string;
}

export interface MachineSerialHistory {
  id: string;
  date: string;
  action: string;
  performedBy: string;
  notes?: string;
}

export interface MachineSerial {
  id: string;
  serialNumber: string;
  productId: string;
  productCode: string;
  productName: string;
  model?: string;
  brand: string;
  origin?: string;
  manufactureYear?: number;
  status: MachineSerialStatus;

  // Warehouse Info
  warehouseId: string;
  warehouseName: string;
  warehouseAddress?: string;
  warehouseManager?: string;
  stockEntryDate?: string;

  // Sales Info
  saleDate?: string;
  salesChannel?: SalesChannel;
  salespersonName?: string;

  // Customer Info
  customerId?: string;
  customerName?: string;
  customerType?: CustomerType;
  customerPhone?: string;
  installationAddress?: string;

  // Order Info
  orderId?: string;
  orderNumber?: string;
  orderStatus?: OrderStatus;
  orderTotalAmount?: number;
  orderPaymentStatus?: PaymentStatus;

  // Installation Info
  installationId?: string;
  technicianName?: string;
  installationScheduledDate?: string;
  installationCompletedDate?: string;
  installationStatus?: InstallationStatus;
  installationChecklist?: { title: string; completed: boolean }[];

  // Warranty Info
  warrantyId?: string;
  warrantyCode?: string;
  warrantyType?: 'STANDARD' | 'EXTENDED' | 'PREMIUM';
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  warrantyStatus?: WarrantyStatus;

  // Maintenance & Repair History
  maintenanceHistory?: MaintenanceRecord[];

  notes?: string;
  history?: MachineSerialHistory[];
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'AWAITING_INSTALLATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'REFUNDED';

export type SalesChannel = 'SHOWROOM' | 'DIRECT_SALES' | 'WEBSITE' | 'PARTNER';

export interface OrderItem {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  productType: ProductType;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  assignedSerials?: string[];
  deliveryDate?: string;
  installationDate?: string;
  technicianName?: string;
  acceptanceSigned?: boolean;
}

export interface OrderPaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  reference: string;
}

export interface OrderDeliveryInfo {
  carrier: string;
  trackingNumber: string;
  address: string;
  estimatedDate: string;
  actualDate?: string;
  status: string;
}

export interface OrderInstallationInfo {
  technicianName: string;
  scheduledDate: string;
  completedDate?: string;
  status: string;
  acceptanceSigned: boolean;
  checklist: { title: string; completed: boolean }[];
}

export interface OrderInvoiceInfo {
  companyName: string;
  taxCode: string;
  invoiceNumber: string;
  issuedDate: string;
  status: 'ISSUED' | 'PENDING' | 'CANCELLED';
}

export interface OrderStatusHistoryItem {
  id: string;
  date: string;
  action: string;
  performedBy: string;
  notes?: string;
  type?: 'order' | 'delivery' | 'installation' | 'handover';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerType: CustomerType;
  salesChannel: SalesChannel;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  hasEquipment: boolean;
  items: OrderItem[];
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
  salespersonName: string;
  notes?: string;
  deliveryInfo?: OrderDeliveryInfo;
  installationInfo?: OrderInstallationInfo;
  invoiceInfo?: OrderInvoiceInfo;
  paymentHistory?: OrderPaymentHistory[];
  statusHistory?: OrderStatusHistoryItem[];
  createdAt: string;
}

export type InstallationStatus =
  | 'PENDING'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface Installation {
  id: string;
  code: string;
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  serialNumber: string;
  productName: string;
  technicianId?: string;
  technicianName?: string;
  scheduledDate: string;
  completedDate?: string;
  status: InstallationStatus;
  notes?: string;
  acceptanceSigned: boolean;
  checklist?: { title: string; completed: boolean }[];
  createdAt: string;
}

export type WarrantyStatus = 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'VOID';

export interface Warranty {
  id: string;
  code: string;
  serialNumber: string;
  productId: string;
  productName: string;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: WarrantyStatus;
  warrantyType: 'STANDARD' | 'EXTENDED' | 'PREMIUM';
  claimsCount: number;
  notes?: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  address: string;
  managerName: string;
  phone: string;
  totalEquipments: number;
  totalConsumables: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface InventoryItem {
  id: string;
  warehouseId: string;
  warehouseName: string;
  productId: string;
  productCode: string;
  productName: string;
  category: string;
  type: ProductType;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  minThreshold: number;
  status: 'NORMAL' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface Technician {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialty: string;
  status: 'AVAILABLE' | 'ON_JOB' | 'OFFLINE';
  activeJobsCount: number;
}

// ==========================================
// Dashboard Specific Models
// ==========================================

export type AlertSeverity = 'high' | 'medium' | 'low';

export interface OperationalAlert {
  id: string;
  category: 'inventory' | 'order' | 'payment' | 'installation' | 'warranty' | 'maintenance';
  title: string;
  description: string;
  severity: AlertSeverity;
  count?: number;
  ctaText: string;
  ctaHref: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  ordersCount: number;
}

export interface TopProductSummary {
  id: string;
  code: string;
  name: string;
  type: ProductType;
  unitsSold: number;
  totalRevenue: number;
}

export interface DashboardSummary {
  kpis: {
    revenue: { current: number; changePercent: number; compareText: string };
    orders: { current: number; changePercent: number; compareText: string };
    newCustomers: { current: number; changePercent: number; compareText: string };
    averageOrderValue: { current: number; changePercent: number; compareText: string };
  };
  salesTrend: RevenueDataPoint[];
  orderStatusCounts: Record<string, number>;
  topProducts: TopProductSummary[];
  inventorySummary: {
    totalItems: number;
    equipmentsCount: number;
    consumablesCount: number;
    lowStockCount: number;
    outOfStockCount: number;
  };
  operationalAlerts: OperationalAlert[];
  afterSales: {
    pendingInstallations: number;
    activeWarranties: number;
    upcomingMaintenances: number;
    unresolvedTickets: number;
  };
}
