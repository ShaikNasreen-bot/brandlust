'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit, 
  Check, 
  AlertCircle, 
  Clock, 
  Layers, 
  Tag, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { getProducts, getCategories, getBrands } from '@/lib/supabase/products';
import { getAllOrders, updateOrderStatus } from '@/lib/supabase/orders';
import { Product, Category, Brand, Order, OrderStatus } from '@/types/database';

export default function AdminDashboardPage() {
  const { user, profile, isAdmin, isLoading: authLoading, setDemoAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'categories'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  // New Product Modal Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCat, setNewProductCat] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductOrigPrice, setNewProductOrigPrice] = useState(3999);
  const [newProductSellPrice, setNewProductSellPrice] = useState(2999);
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [newProductSizes, setNewProductSizes] = useState(['S', 'M', 'L', 'XL']);
  const [newProductStock, setNewProductStock] = useState(25);

  // Quick edit product state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);
  const [editStock, setEditStock] = useState(0);

  const loadAllAdminData = async () => {
    setLoading(true);
    const [prodsData, catsData, brandsData, ordersData] = await Promise.all([
      getProducts(),
      getCategories(),
      getBrands(),
      getAllOrders(),
    ]);
    setProducts(prodsData.products);
    setCategories(catsData);
    setBrands(brandsData);
    setOrders(ordersData);
    setLoading(false);
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // Access check
  if (!authLoading && !isAdmin) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto text-red-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-stone-950">
          Admin Access Required
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          You must have administrator credentials to access the BRAND LUST control panel.
        </p>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              setDemoAdmin();
            }}
            className="w-full py-3 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Demo Admin Account</span>
          </button>
          <Link
            href="/"
            className="block text-xs text-stone-600 hover:text-black font-semibold underline"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // Calculate high-level metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalStockQuantity = products.reduce(
    (sum, p) => sum + p.variants.reduce((vSum, v) => vSum + v.stock_quantity, 0),
    0
  );

  // Status updater
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    setFeedback(`Order status updated to "${newStatus}".`);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Delete product handler
  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to remove this garment from the active catalog?')) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setFeedback('Product removed from catalog.');
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  // Save quick price/stock update
  const handleSaveQuickEdit = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            selling_price: editPrice,
            variants: p.variants.map((v) => ({ ...v, stock_quantity: editStock })),
          };
        }
        return p;
      })
    );
    setEditingProductId(null);
    setFeedback('Product pricing & stock updated.');
    setTimeout(() => setFeedback(null), 3000);
  };

  // Add new product handler
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.round(((newProductOrigPrice - newProductSellPrice) / newProductOrigPrice) * 100);
    const newId = `prod-custom-${Date.now()}`;
    const slug = newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const createdProduct: Product = {
      id: newId,
      name: newProductName,
      slug,
      description: newProductDesc,
      category_id: newProductCat || categories[0]?.id || 'cat-1',
      brand_id: newProductBrand || brands[0]?.id || 'brand-1',
      original_price: Number(newProductOrigPrice),
      selling_price: Number(newProductSellPrice),
      discount_percent: discount,
      rating: 5.0,
      rating_count: 1,
      is_featured: true,
      is_trending: true,
      is_new_arrival: true,
      is_best_seller: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category: categories.find((c) => c.id === newProductCat) || categories[0],
      brand: brands.find((b) => b.id === newProductBrand) || brands[0],
      images: [
        {
          id: `img-${Date.now()}`,
          product_id: newId,
          image_url: newProductImageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
          alt_text: newProductName,
          is_primary: true,
          display_order: 1,
        },
      ],
      variants: newProductSizes.map((sz, idx) => ({
        id: `var-${Date.now()}-${idx}`,
        product_id: newId,
        size: sz,
        color: 'Neutral',
        sku: `SH-${slug.slice(0, 5).toUpperCase()}-${sz}`,
        stock_quantity: Number(newProductStock),
      })),
    };

    setProducts([createdProduct, ...products]);
    setShowAddProductModal(false);
    setFeedback(`Product "${newProductName}" added successfully.`);
    setTimeout(() => setFeedback(null), 3000);

    // Reset form
    setNewProductName('');
    setNewProductDesc('');
    setNewProductImageUrl('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-stone-900 text-white text-[10px] font-bold uppercase tracking-wider rounded">
              Administrator Portal
            </span>
            <span className="text-xs text-stone-500">• Authorized as {user?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950 mt-1">
            BRAND LUST Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-4 py-2.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Garment</span>
          </button>
          <button
            onClick={loadAllAdminData}
            className="p-2.5 border border-stone-300 text-stone-700 hover:bg-stone-100 transition"
            title="Refresh Catalog Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="mb-6 p-3 bg-stone-900 text-white text-xs flex items-center gap-2 shadow animate-fadeIn">
          <Check className="w-4 h-4 text-green-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 mb-8 space-x-8 text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'overview'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'products'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          Garment Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'orders'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          Customer Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 transition border-b-2 ${
            activeTab === 'categories'
              ? 'border-stone-950 text-stone-950'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          Categories & Brands
        </button>
      </div>

      {/* TAB 1: OVERVIEW & BASIC SALES METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 border border-stone-200 space-y-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold flex items-center justify-between">
                <span>Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-stone-900" />
              </span>
              <p className="text-2xl font-black text-stone-950">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-stone-500">Across verified customer orders</p>
            </div>

            <div className="bg-white p-6 border border-stone-200 space-y-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold flex items-center justify-between">
                <span>Total Orders</span>
                <Package className="w-4 h-4 text-stone-900" />
              </span>
              <p className="text-2xl font-black text-stone-950">{totalOrdersCount}</p>
              <p className="text-[11px] text-stone-500">Active fulfillment pipelines</p>
            </div>

            <div className="bg-white p-6 border border-stone-200 space-y-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold flex items-center justify-between">
                <span>Active Garments</span>
                <Layers className="w-4 h-4 text-stone-900" />
              </span>
              <p className="text-2xl font-black text-stone-950">{totalProductsCount}</p>
              <p className="text-[11px] text-stone-500">In 8 fashion categories</p>
            </div>

            <div className="bg-white p-6 border border-stone-200 space-y-2">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold flex items-center justify-between">
                <span>Total Stock Units</span>
                <ShoppingBag className="w-4 h-4 text-stone-900" />
              </span>
              <p className="text-2xl font-black text-stone-950">{totalStockQuantity}</p>
              <p className="text-[11px] text-stone-500">Available across size variants</p>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white p-6 border border-stone-200 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-950 pb-2 border-b border-stone-100 flex items-center justify-between">
              <span>Recent Orders Feed</span>
              <button onClick={() => setActiveTab('orders')} className="text-xs text-stone-500 hover:text-black underline">
                View All Orders
              </button>
            </h2>

            {orders.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">No orders created yet.</p>
            ) : (
              <div className="divide-y divide-stone-100">
                {orders.slice(0, 5).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-mono font-bold text-stone-900">{ord.order_number}</p>
                      <p className="text-[11px] text-stone-500">
                        {ord.shipping_full_name} • {ord.shipping_city}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-950 block">₹{ord.total_amount.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] uppercase font-bold text-stone-600 bg-stone-100 px-2 py-0.5">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Garments in Atelier Catalog ({products.length})
            </span>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-3 py-1.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-600">
              <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-200">
                <tr>
                  <th className="p-3">Garment</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Brand</th>
                  <th className="p-3">Selling Price</th>
                  <th className="p-3">Original Price</th>
                  <th className="p-3">Total Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((prod) => {
                  const stockSum = prod.variants.reduce((acc, v) => acc + v.stock_quantity, 0);
                  const isEditing = editingProductId === prod.id;
                  const thumb = prod.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=100&q=80';

                  return (
                    <tr key={prod.id} className="hover:bg-stone-50/50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200">
                            <Image src={thumb} alt={prod.name} fill className="object-cover" />
                          </div>
                          <div>
                            <Link href={`/products/${prod.slug || prod.id}`} className="font-semibold text-stone-900 hover:underline line-clamp-1">
                              {prod.name}
                            </Link>
                            <span className="text-[10px] text-stone-400">
                              Sizes: {prod.variants.map((v) => v.size).join(', ')}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{prod.category?.name || 'Category'}</td>
                      <td className="p-3">{prod.brand?.name || 'Brand'}</td>
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-20 p-1 border border-stone-300 text-stone-900"
                          />
                        ) : (
                          <span className="font-bold text-stone-950">₹{prod.selling_price.toLocaleString('en-IN')}</span>
                        )}
                      </td>
                      <td className="p-3 text-stone-400 line-through">
                        ₹{prod.original_price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-16 p-1 border border-stone-300 text-stone-900"
                          />
                        ) : (
                          <span className={`font-semibold ${stockSum > 0 ? 'text-stone-800' : 'text-red-600'}`}>
                            {stockSum} units
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleSaveQuickEdit(prod.id)}
                              className="px-2 py-1 bg-stone-900 text-white text-[10px] font-bold uppercase hover:bg-black"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingProductId(null)}
                              className="px-2 py-1 border border-stone-300 text-[10px] font-bold uppercase hover:bg-stone-100"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProductId(prod.id);
                                setEditPrice(prod.selling_price);
                                setEditStock(prod.variants?.[0]?.stock_quantity || 20);
                              }}
                              className="p-1.5 text-stone-500 hover:text-black hover:bg-stone-100 transition"
                              title="Edit Price & Stock"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-200">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Customer Orders & Pipeline Status ({orders.length})
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-stone-400">
              No orders have been submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-[10px] uppercase tracking-widest text-stone-400 border-b border-stone-200">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/50">
                      <td className="p-3 font-mono font-bold text-stone-900">
                        <Link href={`/orders/${ord.order_number}`} className="hover:underline">
                          {ord.order_number}
                        </Link>
                      </td>
                      <td className="p-3">
                        <p className="font-semibold text-stone-900">{ord.shipping_full_name}</p>
                        <p className="text-[10px] text-stone-400">{ord.shipping_phone}</p>
                      </td>
                      <td className="p-3 text-stone-500">
                        {new Date(ord.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>
                      <td className="p-3">
                        {ord.items?.length || 1} items
                      </td>
                      <td className="p-3 font-bold text-stone-950">
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span className="inline-block px-2 py-0.5 bg-stone-100 text-stone-800 text-[10px] font-semibold">
                          {ord.payment_method} ({ord.payment_status})
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                          ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          ord.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderStatus)}
                          className="p-1 border border-stone-300 text-xs bg-white text-stone-900 font-medium cursor-pointer"
                        >
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CATEGORIES & BRANDS */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Categories */}
          <div className="bg-white border border-stone-200 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
              Active Garment Categories ({categories.length})
            </h3>
            <div className="divide-y divide-stone-100">
              {categories.map((c) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{c.name}</span>
                    <span className="text-[10px] text-stone-400 block font-mono">/{c.slug}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 uppercase">
                    Order: {c.display_order}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="bg-white border border-stone-200 p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-100">
              Atelier Brands & Labels ({brands.length})
            </h3>
            <div className="divide-y divide-stone-100">
              {brands.map((b) => (
                <div key={b.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{b.name}</span>
                    <span className="text-[10px] text-stone-400 block">{b.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white max-w-xl w-full p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Add New Garment to Catalog
              </h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-stone-400 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-stone-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Italian Wool Double Breasted Blazer"
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  placeholder="Describe material composition, weave structure, and silhouette..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-stone-700 mb-1">Category</label>
                  <select
                    value={newProductCat}
                    onChange={(e) => setNewProductCat(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-stone-700 mb-1">Brand</label>
                  <select
                    value={newProductBrand}
                    onChange={(e) => setNewProductBrand(e.target.value)}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-stone-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProductOrigPrice}
                    onChange={(e) => setNewProductOrigPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-stone-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProductSellPrice}
                    onChange={(e) => setNewProductSellPrice(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-stone-700 mb-1">Product Image URL</label>
                <input
                  type="url"
                  value={newProductImageUrl}
                  onChange={(e) => setNewProductImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-stone-700 mb-1">Stock Quantity Per Size</label>
                <input
                  type="number"
                  required
                  value={newProductStock}
                  onChange={(e) => setNewProductStock(Number(e.target.value))}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 border border-stone-300 text-stone-800 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-stone-950 text-white font-bold uppercase hover:bg-black"
                >
                  Create Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
