export interface Sport {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sportId: string;
  image: string;
  children?: Category[];
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface Variant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice: number | null;
  brand: string;
  gender: "men" | "women" | "unisex" | "kids";
  tags: string[];
  sportId: string;
  categoryId: string;
  images: ProductImage[];
  variants: Variant[];
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  status?: "draft" | "active" | "archived";
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  product: Product;
  variant: Variant;
}

export interface FilterState {
  sport?: string;
  category?: string;
  gender?: string;
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  search?: string;
  page?: number;
}

export interface FacetCount {
  value: string;
  label: string;
  count: number;
  hex?: string;
}

export interface Facets {
  sports: FacetCount[];
  categories: FacetCount[];
  genders: FacetCount[];
  sizes: FacetCount[];
  colors: FacetCount[];
  brands: FacetCount[];
  priceRange: { min: number; max: number };
}

export interface Address {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  estimatedDays: { min: number; max: number };
}

export interface PaymentInfo {
  method: "stripe";
}

export interface OrderItem {
  productId: string;
  variantId: string;
  quantity: number;
  name: string;
  variant: string;
  price: number;
  image: string;
}

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "shipped"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  waybill: string;
  items: OrderItem[];
  shippingAddress: Address;
  shippingRate: ShippingRate;
  payment: PaymentInfo;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  createdAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
  status: "active" | "inactive" | "blocked";
  addresses: Address[];
  createdAt: string;
}
