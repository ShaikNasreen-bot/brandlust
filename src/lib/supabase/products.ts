import { getSupabaseClient, isSupabaseConfigured } from './client';
import { INITIAL_PRODUCTS_HYDRATED, CATEGORIES, BRANDS } from '@/lib/mock-data';
import { Product, Category, Brand, FilterState } from '@/types/database';

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Category[];
      }
    } catch (err) {
      console.warn('Error fetching categories from Supabase, using local fallback:', err);
    }
  }
  return CATEGORIES;
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Brand[];
      }
    } catch (err) {
      console.warn('Error fetching brands from Supabase, using local fallback:', err);
    }
  }
  return BRANDS;
}

export async function getProducts(filters?: Partial<FilterState>): Promise<{ products: Product[]; total: number }> {
  const supabase = getSupabaseClient();
  
  // Try Supabase first if configured
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          brand:brands(*),
          images:product_images(*),
          variants:product_variants(*)
        `);

      if (filters?.categories && filters.categories.length > 0) {
        // Query by category slug or ID
        const cats = await getCategories();
        const catIds = cats
          .filter(c => filters.categories?.includes(c.slug) || filters.categories?.includes(c.id))
          .map(c => c.id);
        if (catIds.length > 0) {
          query = query.in('category_id', catIds);
        }
      }

      if (filters?.brands && filters.brands.length > 0) {
        const brands = await getBrands();
        const brandIds = brands
          .filter(b => filters.brands?.includes(b.slug) || filters.brands?.includes(b.id) || filters.brands?.includes(b.name))
          .map(b => b.id);
        if (brandIds.length > 0) {
          query = query.in('brand_id', brandIds);
        }
      }

      if (filters?.minPrice !== undefined && filters.minPrice > 0) {
        query = query.gte('selling_price', filters.minPrice);
      }
      if (filters?.maxPrice !== undefined && filters.maxPrice < 30000) {
        query = query.lte('selling_price', filters.maxPrice);
      }

      if (filters?.isNewArrival) {
        query = query.eq('is_new_arrival', true);
      }
      if (filters?.isBestSeller) {
        query = query.eq('is_best_seller', true);
      }
      if (filters?.discountOnly) {
        query = query.gt('discount_percent', 0);
      }
      if (filters?.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      if (filters?.searchQuery && filters.searchQuery.trim()) {
        const q = filters.searchQuery.trim();
        query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
      }

      // Sorting
      if (filters?.sortBy === 'price-asc') {
        query = query.order('selling_price', { ascending: true });
      } else if (filters?.sortBy === 'price-desc') {
        query = query.order('selling_price', { ascending: false });
      } else if (filters?.sortBy === 'top-rated') {
        query = query.order('rating', { ascending: false });
      } else if (filters?.sortBy === 'popularity') {
        query = query.order('rating_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        let result = data as Product[];
        
        // Filter by size or color on the variants if requested
        if (filters?.sizes && filters.sizes.length > 0) {
          result = result.filter(p => 
            p.variants?.some(v => filters.sizes?.includes(v.size) && v.stock_quantity > 0)
          );
        }
        if (filters?.colors && filters.colors.length > 0) {
          result = result.filter(p => 
            p.variants?.some(v => filters.colors?.some(c => v.color.toLowerCase() === c.toLowerCase()))
          );
        }

        return { products: result, total: result.length };
      }
    } catch (err) {
      console.warn('Error fetching products from Supabase, using local fallback:', err);
    }
  }

  // Graceful fallback to rich mock data
  let list = [...INITIAL_PRODUCTS_HYDRATED];

  if (filters?.categories && filters.categories.length > 0) {
    list = list.filter(p => 
      filters.categories?.includes(p.category_id) || 
      (p.category && filters.categories?.includes(p.category.slug))
    );
  }

  if (filters?.brands && filters.brands.length > 0) {
    list = list.filter(p => 
      filters.brands?.includes(p.brand_id) || 
      (p.brand && (filters.brands?.includes(p.brand.slug) || filters.brands?.includes(p.brand.name)))
    );
  }

  if (filters?.sizes && filters.sizes.length > 0) {
    list = list.filter(p => 
      p.variants.some(v => filters.sizes?.includes(v.size) && v.stock_quantity > 0)
    );
  }

  if (filters?.colors && filters.colors.length > 0) {
    list = list.filter(p => 
      p.variants.some(v => filters.colors?.some(c => v.color.toLowerCase() === c.toLowerCase()))
    );
  }

  if (filters?.minPrice !== undefined) {
    list = list.filter(p => p.selling_price >= (filters.minPrice ?? 0));
  }
  if (filters?.maxPrice !== undefined) {
    list = list.filter(p => p.selling_price <= (filters.maxPrice ?? 30000));
  }

  if (filters?.minRating) {
    list = list.filter(p => p.rating >= (filters.minRating ?? 0));
  }

  if (filters?.isNewArrival) {
    list = list.filter(p => p.is_new_arrival);
  }
  if (filters?.isBestSeller) {
    list = list.filter(p => p.is_best_seller);
  }
  if (filters?.discountOnly) {
    list = list.filter(p => p.discount_percent > 0);
  }

  if (filters?.searchQuery && filters.searchQuery.trim()) {
    const q = filters.searchQuery.trim().toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category?.name.toLowerCase().includes(q) ||
      p.brand?.name.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (filters?.sortBy === 'price-asc') {
    list.sort((a, b) => a.selling_price - b.selling_price);
  } else if (filters?.sortBy === 'price-desc') {
    list.sort((a, b) => b.selling_price - a.selling_price);
  } else if (filters?.sortBy === 'top-rated') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (filters?.sortBy === 'popularity') {
    list.sort((a, b) => b.rating_count - a.rating_count);
  } else {
    // Newest
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return { products: list, total: list.length };
}

export async function getProductById(idOrSlug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (isSupabaseConfigured && supabase) {
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          brand:brands(*),
          images:product_images(*),
          variants:product_variants(*),
          reviews:reviews(*)
        `);

      if (isUuid) {
        query = query.eq('id', idOrSlug);
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.single();
      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.warn('Error fetching single product from Supabase:', err);
    }
  }

  const found = INITIAL_PRODUCTS_HYDRATED.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  return found || null;
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  const { products } = await getProducts({ categories: [categoryId] });
  return products.filter(p => p.id !== productId).slice(0, limit);
}
