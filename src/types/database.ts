export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  created_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string; // 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'
  color: string;
  sku: string | null;
  stock_quantity: number;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  brand_id: string;
  original_price: number;
  selling_price: number;
  discount_percent: number;
  rating: number;
  rating_count: number;
  is_featured: boolean;
  is_trending: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  created_at: string;
  updated_at: string;
  // Joined relations
  category?: Category;
  brand?: Brand;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  cart_id?: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  created_at?: string;
  // Joined relations
  product: Product;
  variant: ProductVariant;
}

export interface WishlistItem {
  id: string;
  wishlist_id?: string;
  product_id: string;
  created_at?: string;
  product: Product;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'COD' | 'Razorpay' | 'Card' | 'UPI';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  size: string;
  color: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_charges: number;
  discount_amount: number;
  total_amount: number;
  shipping_full_name: string;
  shipping_email: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number | null;
  isNewArrival: boolean;
  isBestSeller: boolean;
  discountOnly: boolean;
  searchQuery: string;
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'popularity' | 'top-rated';
}
