import { getSupabaseClient, isSupabaseConfigured } from './client';
import { Order, OrderItem, OrderStatus, PaymentMethod, PaymentStatus } from '@/types/database';

export interface CreateOrderInput {
  userId?: string | null;
  items: {
    productId: string;
    variantId: string;
    productName: string;
    size: string;
    color: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
  subtotal: number;
  deliveryCharges: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  shipping: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

// Generate unique human-readable order number like SH-8942-7193
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `SH-${timestamp}-${random}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const supabase = getSupabaseClient();
  const orderNumber = generateOrderNumber();

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    order_number: orderNumber,
    user_id: input.userId || null,
    status: 'confirmed',
    payment_method: input.paymentMethod,
    payment_status: input.paymentMethod === 'COD' ? 'pending' : 'completed',
    subtotal: input.subtotal,
    delivery_charges: input.deliveryCharges,
    discount_amount: input.discountAmount,
    total_amount: input.totalAmount,
    shipping_full_name: input.shipping.fullName,
    shipping_email: input.shipping.email,
    shipping_phone: input.shipping.phone,
    shipping_address: input.shipping.address,
    shipping_city: input.shipping.city,
    shipping_state: input.shipping.state,
    shipping_postal_code: input.shipping.postalCode,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    items: input.items.map((it, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      order_id: '',
      product_id: it.productId,
      variant_id: it.variantId,
      product_name: it.productName,
      size: it.size,
      color: it.color,
      unit_price: it.unitPrice,
      quantity: it.quantity,
      total_price: it.totalPrice,
    })),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: input.userId || null,
          status: newOrder.status,
          payment_method: input.paymentMethod,
          payment_status: newOrder.payment_status,
          subtotal: input.subtotal,
          delivery_charges: input.deliveryCharges,
          discount_amount: input.discountAmount,
          total_amount: input.totalAmount,
          shipping_full_name: input.shipping.fullName,
          shipping_email: input.shipping.email,
          shipping_phone: input.shipping.phone,
          shipping_address: input.shipping.address,
          shipping_city: input.shipping.city,
          shipping_state: input.shipping.state,
          shipping_postal_code: input.shipping.postalCode,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderId = orderData.id;
      newOrder.id = orderId;

      // 2. Insert order items
      const orderItemsToInsert = input.items.map((it) => ({
        order_id: orderId,
        product_id: it.productId,
        variant_id: it.variantId,
        product_name: it.productName,
        size: it.size,
        color: it.color,
        unit_price: it.unitPrice,
        quantity: it.quantity,
        total_price: it.totalPrice,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Decrement stock safely for each variant
      for (const it of input.items) {
        if (it.variantId) {
          try {
            await supabase.rpc('decrement_variant_stock', {
              var_id: it.variantId,
              qty: it.quantity,
            });
          } catch (stockErr) {
            console.warn('Stock decrement RPC note:', stockErr);
          }
        }
      }

      return {
        ...newOrder,
        id: orderId,
      };
    } catch (err) {
      console.error('Supabase createOrder error, storing locally:', err);
    }
  }

  // Fallback: save order to localStorage so orders page can display it
  if (typeof window !== 'undefined') {
    const existingOrders = JSON.parse(localStorage.getItem('BRAND LUST_orders') || '[]');
    existingOrders.unshift(newOrder);
    localStorage.setItem('BRAND LUST_orders', JSON.stringify(existingOrders));
  }

  return newOrder;
}

export async function getUserOrders(userId?: string): Promise<Order[]> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Order[];
      }
    } catch (err) {
      console.warn('Error fetching orders from Supabase:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const localOrders = JSON.parse(localStorage.getItem('BRAND LUST_orders') || '[]');
    if (userId) {
      return localOrders.filter((o: Order) => o.user_id === userId || !o.user_id);
    }
    return localOrders;
  }
  return [];
}

export async function getAllOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          items:order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Order[];
      }
    } catch (err) {
      console.warn('Error fetching all orders from Supabase:', err);
    }
  }

  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('BRAND LUST_orders') || '[]');
  }
  return [];
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (!error) return true;
    } catch (err) {
      console.error('Error updating order status in Supabase:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const localOrders: Order[] = JSON.parse(localStorage.getItem('BRAND LUST_orders') || '[]');
    const updated = localOrders.map((o) => (o.id === orderId ? { ...o, status } : o));
    localStorage.setItem('BRAND LUST_orders', JSON.stringify(updated));
    return true;
  }
  return false;
}
