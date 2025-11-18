import {
  ContactStatus,
  PaymentStatus,
  PurchaseItemType,
  SubscriptionPeriod,
} from '@/lib/utils';
import { Multimedia } from './product';
import { Purchase, SubscriptionPlan } from './payment';

// Business details
export interface Role {
  id: string;
  name: string;
  role_id: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
  role: Role;
}

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  business_size: 'small' | 'medium' | 'large';
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  state: string | null;
  country: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface BusinessResponse {
  statusCode: number;
  data: Business[];
  count: number;
}

// Business details by id
export interface Profile {
  profile_picture: string;
  gender: string;
  bio: string;
  state: string | null;
  country: string;
}

export interface UserDetails {
  name: string;
  profile: Profile;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  profile: Profile;
  created_at: string;
  updated_at: string;
  role: Role;
}

export interface BusinessWallet {
  id: string;
  business_id: string;
  balance: string;
  previous_balance: string;
  currency: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface OnboardingStatus {
  id: string;
  user_id: string;
  business_id: string;
  current_step: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface WithdrawalAccount {
  id: string;
  business_id: string;
  account_number: string;
  account_type: string;
  bank_name: string;
  country: string;
  country_code: string;
  currency: string;
  routing_number: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  deleted_at: string | null;
}

export interface BusinessStat {
  total_revenue: string | null;
  payments_count: number;
}

export interface BusinessDetails {
  id: string;
  user_id: string;
  business_name: string;
  business_size: string;
  timeline: string;
  logo_url: string;
  industry: string;
  working_hours: string | null;
  location: string;
  state: string | null;
  country: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  user: User;
  business_wallet: BusinessWallet;
  withdrawal_account: WithdrawalAccount;
  onboarding_status: OnboardingStatus | null;
  stat: BusinessStat;
}

export interface BusinessDetailsResponse {
  statusCode: number;
  message: string;
  data: BusinessDetails;
}

// KYC
export interface KycType {
  id: string;
  business_id: string;
  user_id: string | null;
  doc_front: string | null;
  doc_back: string | null;
  utility_doc: string | null;
  location: string | null;
  state: string | null;
  city: string | null;
  country: string | null;
  country_code: string | null;
  id_type: string;
  is_approved: boolean;
  disapproval_reason: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null; 
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface KycResponse {
  statusCode: number;
  data: KycType[];
}


// Contact
export interface ContactRole {
  name: string;
  role_id: string;
}

export interface ContactUser {
  id: string;
  role: ContactRole;
}

export interface ContactAccount {
  id: string;
  name: string;
  email: string;
  is_owner: boolean;
  user: ContactUser;
  status: ContactStatus; // Adjust based on possible values
  expires_at: string | null;
  created_at: string;
}

export interface ContactResponse {
  statusCode: number;
  data: ContactAccount[];
  count: number;
}

export interface Profile {
  id: string;
  user_id: string;
  profile_picture?: string | null;
  address?: string | null;
  state?: string | null;
  country?: string; // Defaults to "Nigeria"
  country_code?: string; // Defaults to "NG"
  bio?: string | null;
  date_of_birth?: string | null; // Consider using `Date` if parsing is needed
  gender?: Gender | null;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  deleted_at?: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  payments: Payment[];
  created_at: string; // ISO string
  updated_at: string; // ISO string
  role: Role;
  profile: Profile | null;
}

export interface Payment {
  id: string;
  purchase: Purchase;
  subscription_plan: SubscriptionPlan;
  created_at: string;
  currency: string;
  amount: string;
  discount_applied: string;
  payment_status: PaymentStatus;
  purchase_type: PurchaseItemType;
  interval: SubscriptionPeriod;
  auto_renew: boolean;
  is_renewal: boolean;
  is_upgrade: boolean;
}

export interface CustomersResponse {
  statusCode: number;
  data: Customer[];
  count: number;
}

export interface BusinessOwner {
  id: string;
  name: string;
  email: string;
  profile: {
    profile_picture: string;
    gender: 'male' | 'female' | string;
    bio: string;
    state: string | null;
    country: string;
  } | null;
}

export interface BusinessOwnerResponse {
  statusCode: number;
  data: BusinessOwner[];
  count: number;
}
