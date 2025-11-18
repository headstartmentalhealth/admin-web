import { CartType, EventType, ProductStatus, ProductType } from '@/lib/utils';
import { BusinessInfo } from './product';
import { Media } from './multimedia';
import { User } from './organization';

export interface Product {
  id: string;
  business_id: string;
  category_id: string;
  creator_id: string;
  title: string;
  description: string | null;
  keywords: string | null;
  metadata: any | null;
  type: ProductType;
  status: ProductStatus;
  published_at: string | null;
  archived_at: string | null;
  price: string | null;
  currency: string;
  original_price: string | null;
  multimedia_id: string;
  business_info: BusinessInfo;
  multimedia: Media;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Ticket {
  id: string;
  product_id: string;
  event_start_date: string;
  event_end_date: string;
  event_location: string;
  event_type: EventType;
  auth_details: any | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product: Product;
}

export interface TicketTier {
  id: string;
  ticket_id: string;
  name: string;
  amount: string;
  original_amount: string;
  currency: string;
  description: string | null;
  quantity: number | null;
  remaining_quantity: number | null;
  max_per_purchase: number | null;
  default_view: boolean;
  status: CartType;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  ticket: Ticket;
}

export interface Course {
  id: string;
  business_id: string;
  category_id: string;
  creator_id: string;
  title: string;
  description: string;
  keywords: string | null;
  metadata: any | null;
  type: ProductType.COURSE;
  status: ProductStatus;
  published_at: string | null;
  archived_at: string | null;
  price: string;
  currency: string;
  original_price: string | null;
  multimedia_id: string;
  business_info: BusinessInfo;
  multimedia: Media;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  product_type: ProductType;
  quantity: number;
  price_at_time: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  course_id: string | null;
  ticket_tier_id: string | null;
  course: Course | null;
  ticket_tier: TicketTier | null;
}

export interface Cart {
  id: string;
  created_at: string;
  updated_at: string;
  user: User;
  items: CartItem[];
}

export interface CartResponse {
  statusCode: number;
  data: Cart[];
  count: number;
}
