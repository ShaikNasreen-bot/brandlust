# BRAND LUST – Men's Fashion E-Commerce Atelier

**BRAND LUST** is a modern, responsive men's fashion e-commerce platform built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, Storage)**.

Designed with inspiration from premier European & contemporary fashion houses (Zara, H&M, ASOS, Myntra), BRAND LUST delivers a minimal, neutral aesthetic (black, white, beige, sand) with fluid interactions, dynamic filtering, persistent bag/wishlist state, and a full administrative suite.

---

## 1. Key Features

- **Storefront & Homepage**:
  - High-impact editorial hero section with seasonal Autumn/Winter styling.
  - Shop by Category (T-Shirts, Shirts, Jeans, Trousers, Jackets, Hoodies, Shorts, Ethnic Wear).
  - Dynamic Trending Essentials, New Arrivals, and Best Sellers sections.
  - Promotional capsule drop banner and brand atelier value pillars.
- **Dynamic Product Catalog (`/shop`)**:
  - Fetched dynamically from Supabase PostgreSQL (with zero hardcoded mock arrays on UI components).
  - Multi-select facet filtering by **Category**, **Size** (XS to XXXL), **Price slider**, **Color swatches**, and **Brand**.
  - Advanced filters: **New Arrivals**, **Best Sellers**, **Sale / Discounted**, and **Minimum Star Rating**.
  - Sorting: Price (Low to High / High to Low), Newest First, Popularity, and Top Rated.
  - Active filter badges with one-click reset and live product count.
- **Garment Details (`/products/[id]`)**:
  - Multi-view high-resolution image gallery with thumbnail switcher.
  - Variant selector for sizes and colors with real-time stock verification.
  - Enforced size selection before adding to cart (prevents erroneous checkout).
  - Quantity selector, Add to Bag, and Instant Buy Now.
  - Customer review submission & rating summary.
  - Dynamically linked related garments.
- **Cart & Slide-Over Drawer (`/cart`)**:
  - Real-time slide-over bag drawer and dedicated cart page.
  - Size & color preservation, live quantity update with stock ceiling checks.
  - Free delivery milestone progress tracker (Complimentary above ₹1,999).
  - Persisted in Supabase `cart_items` for logged-in members; `localStorage` for guests.
- **Wishlist (`/wishlist`)**:
  - Save garments from cards or product pages.
  - One-click "Move to Cart" with auto-selection of available sizes.
  - Synced to Supabase `wishlists` table.
- **Authentication (`/auth/login`, `/auth/register`, `/auth/forgot-password`)**:
  - Powered by Supabase Authentication.
  - One-click demo credentials for instant testing (Demo Customer & Demo Administrator).
  - Profile & shipping address management (`/profile`).
  - Checkout strictly gated behind authentication to ensure delivery integrity.
- **Checkout & Orders (`/checkout`, `/orders`, `/orders/[id]`)**:
  - Address validation (Name, email, phone, street address, city, state, PIN code).
  - Cash on Delivery (COD) with verified status generation.
  - Ready architecture for Razorpay / Cards / UPI gateway webhooks.
  - Unique human-readable Order Numbers (e.g. `SH-XXXX-XXXX`).
  - Safe variant stock decrement upon order confirmation.
- **Admin Control Panel (`/admin`)**:
  - Role-protected dashboard accessible only to users with `role = 'admin'`.
  - Sales & inventory metrics: Gross Revenue, Total Orders, Active Garments, Stock Units.
  - Full product catalog table with in-line price & stock editing.
  - Add new garment modal with image URL, categories, and variant stock.
  - Customer orders pipeline management with status updater (Processing, Confirmed, Shipped, Delivered, Cancelled).

---

## 2. Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React Server Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security, Supabase Auth)
- **Deployment**: Vercel

---

## 3. Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── admin/          # Role-protected Admin Control Panel
│   │   ├── auth/           # Login, Register, Forgot Password
│   │   ├── cart/           # Full Shopping Bag page
│   │   ├── checkout/       # Address collection & order placement
│   │   ├── orders/         # User orders list & confirmation details
│   │   ├── products/[id]/  # Individual garment details & reviews
│   │   ├── profile/        # User profile & shipping coordinates
│   │   ├── shop/           # Dedicated shopping page with multi-facet filters
│   │   ├── globals.css     # Global styles & luxury transitions
│   │   ├── layout.tsx      # Root layout with Navbar, Footer, and Providers
│   │   └── page.tsx        # Homepage (Hero, Categories, Trending, Promo)
│   ├── components/
│   │   ├── cart/           # CartDrawer slide-over
│   │   ├── layout/         # Navbar, Footer
│   │   └── product/        # ProductCard with quick-add & wishlist
│   ├── lib/
│   │   ├── context/        # AuthContext, CartContext, WishlistContext
│   │   ├── supabase/       # Supabase client, queries for products, orders, cart
│   │   └── mock-data.ts    # 30+ sample fashion garments (fallback & seed data)
│   └── types/
│       └── database.ts     # TypeScript database schemas & interfaces
├── supabase/
│   ├── schema.sql          # Complete PostgreSQL DDL (Tables, RLS, Functions)
│   └── seed.sql            # 30+ Sample products across 8 categories
├── .env.example            # Environment variables blueprint
├── next.config.mjs         # Image domains configuration (Unsplash, Supabase)
└── README.md
```

---

## 4. Supabase Setup Guide

### Step 1: Create a Supabase Project
1. Log in to [supabase.com](https://supabase.com/) and create a new project.
2. Note your **Project URL** and **anon public key** from `Project Settings -> API`.

### Step 2: Run the SQL Schema
1. In the Supabase Dashboard, open the **SQL Editor**.
2. Open the file [`supabase/schema.sql`](supabase/schema.sql) from this repository.
3. Paste the contents into the SQL Editor and click **Run**.
   - This sets up all 13 tables: `profiles`, `categories`, `brands`, `products`, `product_images`, `product_variants`, `carts`, `cart_items`, `wishlists`, `wishlist_items`, `orders`, `order_items`, and `reviews`.
   - It also enables Row Level Security (RLS) policies and stock-decrementing triggers.

### Step 3: Seed Sample Products
1. In the SQL Editor, open [`supabase/seed.sql`](supabase/seed.sql).
2. Paste the contents and click **Run**.
   - This inserts all 8 categories, 6 designer brands, 30+ curated fashion garments, images, and multi-size variants.

---

## 5. Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone <repo-url>
cd FASHION_PROJECT
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```
*(Note: If left empty, BRAND LUST automatically runs with the included high-fidelity local dataset so you can test all features immediately!)*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Vercel Deployment Instructions

1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com/).
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key.
4. Click **Deploy**. Vercel will build and publish your storefront globally.

---

## 7. Testing Demo Accounts

For instant review without entering registration details, use the built-in quick switchers on the Sign In page or Navbar profile dropdown:
- **Demo Customer**: `customer@brandlust.com` (Accesses cart, orders, wishlist)
- **Demo Administrator**: `admin@brandlust.com` (Unlocks full `/admin` dashboard capabilities)
