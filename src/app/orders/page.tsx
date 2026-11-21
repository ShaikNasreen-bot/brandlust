'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Truck, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { getUserOrders } from '@/lib/supabase/orders';
import { Order } from '@/types/database';

export default function OrdersListPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getUserOrders(user?.id);
      setOrders(data);
      setLoading(false);
    }
    load();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-stone-950">
            My Orders
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Track and review your previous atelier orders and delivery statuses.
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-black flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Shop</span>
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs uppercase tracking-widest text-stone-400">
          Loading order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 border border-stone-200 text-center space-y-4">
          <Package className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5]" />
          <h2 className="text-base font-bold uppercase tracking-wider text-stone-900">
            No orders placed yet
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Once you place an order, its real-time shipping coordinates and invoice details will appear here.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-stone-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-stone-200 p-6 space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-4 gap-2">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold block">
                    Order Number
                  </span>
                  <span className="font-mono font-bold text-stone-900 text-sm">
                    {order.order_number}
                  </span>
                </div>
                <div className="text-xs text-stone-500">
                  <span>Placed on </span>
                  <span className="font-medium text-stone-800">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="inline-block px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-900 font-bold uppercase text-[10px] tracking-wider">
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order items */}
              {order.items && order.items.length > 0 && (
                <div className="divide-y divide-stone-100">
                  {order.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-stone-900">{it.product_name}</p>
                        <p className="text-[11px] text-stone-500">
                          Size: {it.size} | Color: {it.color} | Qty: {it.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-stone-950">
                        ₹{it.total_price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Footer */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 gap-2">
                <div>
                  <span>Shipping Address: </span>
                  <span className="font-medium text-stone-900">
                    {order.shipping_city}, {order.shipping_state}
                  </span>
                  <span className="mx-2">•</span>
                  <span>Payment: </span>
                  <span className="font-medium text-stone-900">{order.payment_method}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-stone-400 text-[10px] uppercase block">Total</span>
                    <span className="text-base font-extrabold text-stone-950">
                      ₹{order.total_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    href={`/orders/${order.order_number}`}
                    className="px-3 py-1.5 border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
