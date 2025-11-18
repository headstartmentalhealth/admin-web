export interface Metrics {
  total_organizations: number;
  total_revenue: string;
  total_product_orders: number;
  total_withdrawals: number;
}
export interface MetricsResponse {
  statusCode: number;
  data: Metrics;
}

export interface MonthlyBreakdown {
  month: string; // e.g. "Jan", "Feb"
  product_revenue: string; // e.g. "₦80,000.00"
  subscription_revenue: string;
  withdrawals: string;
}

export interface Totals {
  product_revenue: string;
  subscription_revenue: string;
  withdrawals: string;
}

export interface RevenueReport {
  year: string; // e.g. "2025"
  monthly_breakdown: MonthlyBreakdown[];
  totals: Totals;
}

export interface RevenueResponse {
  statusCode: number;
  data: RevenueReport;
}

export interface ProductCount {
  course: number;
  ticket: number;
}

export interface ProductCountResponse {
  statusCode: number;
  data: ProductCount;
}
