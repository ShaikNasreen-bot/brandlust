import { getSupabaseClient, isSupabaseConfigured } from './client';
import { CartItem } from '@/types/database';

export async function fetchUserCart(userId: string): Promise<CartItem[]> {
  const supabase = getSupabaseClient();
  if (!isSupabaseConfigured || !supabase || !userId) return [];

  try {
    // 1. Get or create cart for user
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart) {
      const { data: newCart, error: createErr } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();
      if (createErr) throw createErr;
      cart = newCart;
    }

    if (!cart?.id) return [];

    // 2. Fetch cart items with product and variant
    const { data: items, error: itemsErr } = await supabase
      .from('cart_items')
      .select(`
        id,
        cart_id,
        product_id,
        variant_id,
        quantity,
        product:products(*, category:categories(*), brand:brands(*), images:product_images(*), variants:product_variants(*)),
        variant:product_variants(*)
      `)
      .eq('cart_id', cart.id);

    if (itemsErr) throw itemsErr;
    return (items || []) as unknown as CartItem[];
  } catch (err) {
    console.warn('Error fetching user cart from Supabase:', err);
    return [];
  }
}

export async function syncCartItemToSupabase(
  userId: string,
  productId: string,
  variantId: string,
  quantity: number
) {
  const supabase = getSupabaseClient();
  if (!isSupabaseConfigured || !supabase || !userId) return;

  try {
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!cart) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();
      cart = newCart;
    }

    if (!cart?.id) return;

    if (quantity <= 0) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)
        .eq('variant_id', variantId);
    } else {
      await supabase
        .from('cart_items')
        .upsert(
          {
            cart_id: cart.id,
            product_id: productId,
            variant_id: variantId,
            quantity,
          },
          { onConflict: 'cart_id,variant_id' }
        );
    }
  } catch (err) {
    console.warn('Error syncing cart item to Supabase:', err);
  }
}

export async function clearUserCartInSupabase(userId: string) {
  const supabase = getSupabaseClient();
  if (!isSupabaseConfigured || !supabase || !userId) return;

  try {
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (cart?.id) {
      await supabase.from('cart_items').delete().eq('cart_id', cart.id);
    }
  } catch (err) {
    console.warn('Error clearing user cart in Supabase:', err);
  }
}
