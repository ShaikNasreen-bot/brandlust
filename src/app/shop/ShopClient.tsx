'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Check
} from 'lucide-react';
import { Product, Category, Brand, FilterState } from '@/types/database';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts } from '@/lib/supabase/products';

interface ShopClientProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
}

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const AVAILABLE_COLORS = [
  { name: 'Black', hex: '#1c1917' },
  { name: 'White', hex: '#f8fafc' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Grey', hex: '#64748b' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Green', hex: '#15803d' },
  { name: 'Beige', hex: '#d4b996' },
];

export function ShopClient({ initialProducts, categories, brands }: ShopClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mobile filters drawer open state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [isNewArrival, setIsNewArrival] = useState<boolean>(false);
  const [isBestSeller, setIsBestSeller] = useState<boolean>(false);
  const [discountOnly, setDiscountOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('newest');

  // Accordion toggle states
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [brandOpen, setBrandOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);

  // Products state
  const [products, setProducts] = useState<Product[]>(initialProducts);

  // Parse URL search parameters on mount / URL change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const match = categories.find(c => c.slug === cat || c.id === cat);
      if (match) setSelectedCategories([match.id]);
    }

    const q = searchParams.get('q');
    if (q) setSearchQuery(q);

    const isNew = searchParams.get('new') === 'true';
    if (isNew) setIsNewArrival(true);

    const isBest = searchParams.get('bestseller') === 'true';
    if (isBest) setIsBestSeller(true);

    const sort = searchParams.get('sort') as FilterState['sortBy'] | null;
    if (sort) setSortBy(sort);
  }, [searchParams, categories]);

  // Fetch or filter products when filter state changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const filterObj: Partial<FilterState> = {
      categories: selectedCategories,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrands,
      minPrice,
      maxPrice,
      minRating,
      isNewArrival,
      isBestSeller,
      discountOnly,
      searchQuery,
      sortBy,
    };

    getProducts(filterObj).then((res) => {
      if (isMounted) {
        setProducts(res.products);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [
    selectedCategories,
    selectedSizes,
    selectedColors,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    isNewArrival,
    isBestSeller,
    discountOnly,
    searchQuery,
    sortBy,
  ]);

  // Toggle helpers
  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const toggleBrand = (brandId: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId]
    );
  };

  const handleClearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(25000);
    setMinRating(null);
    setIsNewArrival(false);
    setIsBestSeller(false);
    setDiscountOnly(false);
    setSearchQuery('');
    setSortBy('newest');
    router.replace('/shop');
  };

  const activeFiltersCount = 
    selectedCategories.length +
    selectedSizes.length +
    selectedColors.length +
    selectedBrands.length +
    (minPrice > 0 ? 1 : 0) +
    (maxPrice < 25000 ? 1 : 0) +
    (minRating ? 1 : 0) +
    (isNewArrival ? 1 : 0) +
    (isBestSeller ? 1 : 0) +
    (discountOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Render the Sidebar Filters Markup (reused in desktop sidebar & mobile drawer)
  const renderFilterContent = () => (
    <div className="space-y-6 text-sm divide-y divide-stone-200">
      
      {/* Header with Clear All */}
      <div className="pt-2 flex items-center justify-between">
        <span className="font-bold text-stone-900 uppercase tracking-wider text-xs">
          Filter By ({activeFiltersCount} active)
        </span>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearAllFilters}
            className="text-xs text-stone-500 hover:text-black flex items-center gap-1 font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="pt-5">
        <button
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-900 mb-3"
        >
          <span>Category</span>
          {categoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {categoryOpen && (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isChecked = selectedCategories.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-black cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-4 h-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
                  />
                  <span className={isChecked ? 'font-semibold text-stone-950' : ''}>
                    {cat.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Size Filter */}
      <div className="pt-5">
        <button
          onClick={() => setSizeOpen(!sizeOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-900 mb-3"
        >
          <span>Size</span>
          {sizeOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {sizeOpen && (
          <div className="grid grid-cols-4 gap-1.5">
            {AVAILABLE_SIZES.map((sz) => {
              const isSelected = selectedSizes.includes(sz);
              return (
                <button
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`py-1.5 text-xs font-medium border transition ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-300 hover:border-black'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Price Filter (Slider & Inputs) */}
      <div className="pt-5">
        <button
          onClick={() => setPriceOpen(!priceOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-900 mb-3"
        >
          <span>Price Range</span>
          {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {priceOpen && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-700">
              <span>₹{minPrice.toLocaleString('en-IN')}</span>
              <span>₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min={0}
              max={25000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="Min"
                className="w-1/2 p-1.5 border border-stone-300 text-stone-900 text-xs"
              />
              <span className="text-stone-400">-</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="Max"
                className="w-1/2 p-1.5 border border-stone-300 text-stone-900 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Color Filter */}
      <div className="pt-5">
        <button
          onClick={() => setColorOpen(!colorOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-900 mb-3"
        >
          <span>Color</span>
          {colorOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {colorOpen && (
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_COLORS.map((col) => {
              const isSelected = selectedColors.includes(col.name);
              return (
                <button
                  key={col.name}
                  onClick={() => toggleColor(col.name)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border rounded-none transition ${
                    isSelected
                      ? 'border-stone-900 bg-stone-100 font-semibold text-stone-950'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-stone-300"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Brand Filter */}
      <div className="pt-5">
        <button
          onClick={() => setBrandOpen(!brandOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-900 mb-3"
        >
          <span>Brand</span>
          {brandOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {brandOpen && (
          <div className="space-y-2">
            {brands.map((b) => {
              const isChecked = selectedBrands.includes(b.id);
              return (
                <label
                  key={b.id}
                  className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-black cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleBrand(b.id)}
                    className="w-4 h-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
                  />
                  <span className={isChecked ? 'font-semibold text-stone-950' : ''}>
                    {b.name}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Special Highlights Filter */}
      <div className="pt-5 space-y-2.5">
        <span className="block text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
          Collections & Highlights
        </span>
        <label className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-black cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isNewArrival}
            onChange={(e) => setIsNewArrival(e.target.checked)}
            className="w-4 h-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
          />
          <span className={isNewArrival ? 'font-semibold text-stone-950' : ''}>New Arrivals</span>
        </label>
        <label className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-black cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => setIsBestSeller(e.target.checked)}
            className="w-4 h-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
          />
          <span className={isBestSeller ? 'font-semibold text-stone-950' : ''}>Best Sellers</span>
        </label>
        <label className="flex items-center gap-2.5 text-xs text-stone-700 hover:text-black cursor-pointer select-none">
          <input
            type="checkbox"
            checked={discountOnly}
            onChange={(e) => setDiscountOnly(e.target.checked)}
            className="w-4 h-4 rounded-none border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
          />
          <span className={discountOnly ? 'font-semibold text-stone-950' : ''}>On Sale / Discounted</span>
        </label>
      </div>

      {/* 7. Rating Filter */}
      <div className="pt-5">
        <button
          onClick={() => setRatingOpen(!ratingOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-stone-900 mb-3"
        >
          <span>Customer Rating</span>
          {ratingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {ratingOpen && (
          <div className="space-y-1.5">
            {[4.5, 4.0, 3.5].map((rat) => (
              <button
                key={rat}
                onClick={() => setMinRating(minRating === rat ? null : rat)}
                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs transition ${
                  minRating === rat ? 'bg-stone-100 font-bold text-stone-900' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                  <span>{rat} & above</span>
                </div>
                {minRating === rat && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-stone-950">
              Men's Collection
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
              From heavy selvedge denim to lightweight french linen. Browse our luxury menswear wardrobe.
            </p>
          </div>

          {/* Active product count & Sorting dropdown */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              {products.length} Products Found
            </span>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 border border-stone-300 text-xs font-semibold uppercase tracking-wider bg-white text-stone-900 shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {/* Sorting Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sortSelect" className="text-xs text-stone-500 uppercase font-medium hidden sm:inline">
                Sort:
              </label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as FilterState['sortBy'])}
                className="py-2 px-3 text-xs bg-white border border-stone-300 text-stone-900 font-medium focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popularity">Popularity</option>
                <option value="top-rated">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-100">
            <span className="text-xs text-stone-500 font-medium">Applied Filters:</span>
            {selectedCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              return (
                <span
                  key={catId}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-xs font-medium"
                >
                  {cat?.name}
                  <button onClick={() => toggleCategory(catId)} className="hover:text-black">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
            {selectedSizes.map((sz) => (
              <span
                key={sz}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-xs font-medium"
              >
                Size: {sz}
                <button onClick={() => toggleSize(sz)} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedColors.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-xs font-medium"
              >
                Color: {c}
                <button onClick={() => toggleColor(c)} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 text-stone-800 text-xs font-medium">
                Keyword: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-black">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearAllFilters}
              className="text-xs text-stone-600 underline hover:text-black ml-2 font-medium"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar (1 Column) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-28 bg-white p-5 border border-stone-200">
            {renderFilterContent()}
          </div>
        </aside>

        {/* Product Cards Grid (3 Columns) */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white border border-stone-200 p-3 space-y-3">
                  <div className="aspect-[3/4] bg-stone-200" />
                  <div className="h-4 bg-stone-200 w-3/4" />
                  <div className="h-4 bg-stone-200 w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border border-stone-200 p-8 space-y-4">
              <Filter className="w-10 h-10 text-stone-400 mx-auto stroke-[1.5]" />
              <h3 className="text-lg font-bold text-stone-900 uppercase tracking-wider">
                No matching garments found
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try loosening your filter criteria or clear all filters to see our full catalogue.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="mt-4 px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter Dialog */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  Filters
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {renderFilterContent()}
              </div>
              <div className="p-4 border-t border-stone-200 bg-stone-50">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition text-center"
                >
                  View {products.length} Products
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
