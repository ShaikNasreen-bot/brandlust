'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight 
} from 'lucide-react';
import { Product } from '@/types/database';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.variants?.[0]?.color || null
  );
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reviews state
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'default', product_id: product.id, image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80', alt_text: product.name, is_primary: true, display_order: 1 }];

  // Distinct sizes and colors
  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color)));

  // Selected variant based on size & color
  const matchedVariant = product.variants.find(
    (v) => v.size === selectedSize && (!selectedColor || v.color === selectedColor)
  ) || product.variants.find((v) => v.size === selectedSize);

  const stockAvailable = matchedVariant ? matchedVariant.stock_quantity : 0;

  const handleAddToCart = () => {
    setErrorMsg(null);
    if (!selectedSize) {
      setErrorMsg('Please select a size to proceed.');
      return;
    }

    if (!matchedVariant) {
      setErrorMsg('This size/color combination is currently unavailable.');
      return;
    }

    if (stockAvailable <= 0) {
      setErrorMsg('Selected variant is out of stock.');
      return;
    }

    const res = addToCart(product, matchedVariant.id, quantity);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => setSuccessMsg(null), 3000);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleBuyNow = () => {
    setErrorMsg(null);
    if (!selectedSize) {
      setErrorMsg('Please select a size to proceed with Buy Now.');
      return;
    }

    if (!matchedVariant || stockAvailable <= 0) {
      setErrorMsg('Selected variant is out of stock.');
      return;
    }

    const res = addToCart(product, matchedVariant.id, quantity);
    if (res.success) {
      router.push('/checkout');
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      product_id: product.id,
      user_id: null,
      user_name: newReviewAuthor.trim(),
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      created_at: new Date().toISOString(),
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-stone-500 uppercase tracking-widest mb-8">
        <Link href="/" className="hover:text-black">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-black">Shop</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?category=${product.category.slug}`} className="hover:text-black">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] w-full bg-stone-100 overflow-hidden border border-stone-200">
            <Image
              src={images[selectedImageIndex]?.image_url || images[0]?.image_url}
              alt={product.name}
              fill
              priority
              className="object-cover object-top transition-transform duration-500 ease-out"
            />
            {product.discount_percent > 0 && (
              <span className="absolute top-4 left-4 bg-stone-950 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                {product.discount_percent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-stone-800 hover:text-black shadow-md transition"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-stone-900 text-stone-900' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[3/4] bg-stone-100 border transition overflow-hidden ${
                    selectedImageIndex === idx ? 'border-stone-950 ring-1 ring-stone-950' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || `View ${idx + 1}`}
                    fill
                    className="object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Meta & Purchase Form */}
        <div className="flex flex-col space-y-6">
          
          {/* Brand & Title */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-2">
              {product.brand?.name || 'BRAND LUST'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
              {product.name}
            </h1>

            {/* Rating & Review Count */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-stone-900 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-stone-900 text-stone-900" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-stone-300">•</span>
              <a href="#reviews" className="text-xs text-stone-500 hover:text-stone-900 underline font-medium">
                {reviewsList.length} Verified Reviews
              </a>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 py-3 border-y border-stone-200">
            <span className="text-2xl sm:text-3xl font-black text-stone-950">
              ₹{product.selling_price.toLocaleString('en-IN')}
            </span>
            {product.original_price > product.selling_price && (
              <>
                <span className="text-base text-stone-400 line-through">
                  ₹{product.original_price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200 uppercase tracking-wider">
                  Save ₹{(product.original_price - product.selling_price).toLocaleString('en-IN')} ({product.discount_percent}%)
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
                Color: <span className="text-stone-500 font-normal">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 text-xs border font-medium transition ${
                      selectedColor === color
                        ? 'border-stone-950 bg-stone-900 text-white'
                        : 'border-stone-300 text-stone-700 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection (Required) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-900">
                Select Size <span className="text-red-500">*</span>
              </label>
              <button className="text-xs text-stone-500 hover:text-stone-900 underline font-medium">
                Size Guide
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {availableSizes.map((size) => {
                const variant = product.variants.find((v) => v.size === size);
                const hasStock = variant && variant.stock_quantity > 0;
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    disabled={!hasStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setErrorMsg(null);
                    }}
                    className={`py-3 text-xs font-bold uppercase tracking-wider border transition flex flex-col items-center justify-center ${
                      isSelected
                        ? 'border-stone-950 bg-stone-950 text-white shadow-md'
                        : hasStock
                        ? 'border-stone-300 text-stone-900 hover:border-stone-950 bg-white'
                        : 'border-stone-200 text-stone-300 bg-stone-50 cursor-not-allowed line-through'
                    }`}
                  >
                    <span>{size}</span>
                  </button>
                );
              })}
            </div>

            {/* Stock Availability indicator */}
            <div className="mt-2.5">
              {selectedSize ? (
                stockAvailable > 0 ? (
                  <p className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>In Stock ({stockAvailable} units ready to dispatch)</span>
                  </p>
                ) : (
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Selected size is sold out.</span>
                  </p>
                )
              ) : (
                <p className="text-xs text-stone-400">
                  Please select an available size to view exact stock status.
                </p>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-900 mb-2">
              Quantity
            </label>
            <div className="inline-flex items-center border border-stone-300 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-stone-600 hover:bg-stone-100 text-sm font-bold"
              >
                -
              </button>
              <span className="px-4 py-2 text-xs font-bold text-stone-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(stockAvailable || 10, quantity + 1))}
                className="px-3 py-2 text-stone-600 hover:bg-stone-100 text-sm font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Shopping Bag</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full py-4 bg-sand-400 text-stone-950 text-xs font-bold uppercase tracking-[0.2em] hover:bg-sand-500 transition flex items-center justify-center gap-2"
            >
              <span>Instant Buy Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Delivery & Assurance Guarantees */}
          <div className="pt-6 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-stone-900 flex-shrink-0" />
              <span>Free Delivery &gt; ₹1,999</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-stone-900 flex-shrink-0" />
              <span>15-Day Free Returns</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-stone-900 flex-shrink-0" />
              <span>Authenticity Certified</span>
            </div>
          </div>

          {/* Product Specifications Table */}
          <div className="pt-6 border-t border-stone-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Garment Specifications
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-xs border border-stone-200 p-4 bg-stone-50/50">
              <span className="text-stone-500 font-medium">Composition</span>
              <span className="text-stone-900 font-semibold">100% Organic Fibers</span>
              <span className="text-stone-500 font-medium">Cut & Silhouette</span>
              <span className="text-stone-900 font-semibold">Relaxed Contemporary Fit</span>
              <span className="text-stone-500 font-medium">Weave Origin</span>
              <span className="text-stone-900 font-semibold">Artisanal Partner Mills</span>
              <span className="text-stone-500 font-medium">Care Recommendation</span>
              <span className="text-stone-900 font-semibold">Cold Machine Wash / Line Dry</span>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews" className="mt-20 pt-12 border-t border-stone-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-stone-950">
                Customer Reviews
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Verified feedback from BRAND LUST clients.
              </p>
            </div>
            <div className="flex items-center gap-2 text-stone-900">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-stone-900 text-stone-900" />
                ))}
              </div>
              <span className="text-sm font-bold">{product.rating.toFixed(1)} / 5.0</span>
            </div>
          </div>

          {/* Review Submission Form */}
          <form onSubmit={handleAddReview} className="bg-stone-100 p-6 border border-stone-200 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Write a Client Review
            </h4>

            {reviewSubmitted && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs">
                Thank you. Your review has been added to this garment.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Julian Hayes"
                  className="w-full p-2 text-xs bg-white border border-stone-300 text-stone-900"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full p-2 text-xs bg-white border border-stone-300 text-stone-900"
                >
                  <option value={5}>5 Stars - Outstanding</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Expectation</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Your Review</label>
              <textarea
                required
                rows={3}
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                placeholder="Share your thoughts on the fabric, drape, and sizing..."
                className="w-full p-2 text-xs bg-white border border-stone-300 text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-black transition"
            >
              Submit Review
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="p-5 bg-white border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{rev.user_name}</span>
                    <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 uppercase tracking-wider font-semibold">
                      Verified Buyer
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-stone-900 text-stone-900" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
                <p className="text-[10px] text-stone-400">
                  {new Date(rev.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-16 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-stone-500 mb-1">
                Complete The Look
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-stone-950">
                Related Products
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-black flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd.id} product={relProd} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
