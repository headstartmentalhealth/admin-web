import { PaymentMethod, PaymentStatus, PurchaseItemType } from '@/lib/utils';

export interface PurchaseItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  created_at: string;
  purchase_type: PurchaseItemType; // Extendable
}

export interface Purchase {
  items: PurchaseItem[];
  coupon_id: string | null;
  business_id: string;
  coupon_type: string | null;
  coupon_value: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_identity: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  purchase_type: string | null;
  purchase_id: string | null;
  amount: string;
  currency: string;
  discount_applied: string;
  payment_status: PaymentStatus; // Extendable
  transaction_id: string;
  payment_method: PaymentMethod;
  billing_id: string | null;
  billing_at_payment: string | null;
  interval: string | null;
  auto_renew: boolean;
  is_renewal: boolean;
  is_upgrade: boolean;
  metadata: any | null;
  purchase: Purchase;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: User;
  subscription_plan: SubscriptionPlan;
  billing_info: string | null;
  refunds: any[];
  payment_gateway_logs: any[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  business_id: string;
  creator_id: string;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
}

export interface PaymentResponse {
  statusCode: number;
  data: Transaction[];
  count: number;
}
