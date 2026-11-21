import { getSupabaseClient, isSupabaseConfigured } from './client';
import { WishlistItem } from '@/types/database';

export async function fetchUserWishlist(userId: string): Promise<WishlistItem[]> {
  const supabase = getSupabaseClient();
  if (!isSupabaseConfigured || !supabase || !userId) return [];

  try {
    let { data: wishlist } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!wishlist) {
      const { data: newWl } = await supabase
        .from('wishlists')
        .insert({ user_id: userId })
        .select('id')
        .single();
      wishlist = newWl;
    }

    if (!wishlist?.id) return [];

    const { data: items, error: itemsErr } = await supabase
      .from('wishlist_items')
      .select(`
        id,
        wishlist_id,
        product_id,
        product:products(*, category:categories(*), brand:brands(*), images:product_images(*), variants:product_variants(*))
      `)
      .eq('wishlist_id', wishlist.id);

    if (itemsErr) throw itemsErr;
    return (items || []) as unknown as WishlistItem[];
  } catch (err) {
    console.warn('Error fetching wishlist from Supabase:', err);
    return [];
  }
}

export async function toggleWishlistItemInSupabase(userId: string, productId: string, add: boolean) {
  const supabase = getSupabaseClient();
  if (!isSupabaseConfigured || !supabase || !userId) return;

  try {
    let { data: wishlist } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (!wishlist) {
      const { data: newWl } = await supabase
        .from('wishlists')
        .insert({ user_id: userId })
        .select('id')
        .single();
      wishlist = newWl;
    }

    if (!wishlist?.id) return;

    if (add) {
      await supabase
        .from('wishlist_items')
        .upsert({ wishlist_id: wishlist.id, product_id: productId }, { onConflict: 'wishlist_id,product_id' });
    } else {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlist.id)
        .eq('product_id', productId);
    }
  } catch (err) {
    console.warn('Error syncing wishlist to Supabase:', err);
  }
}
