'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, Package, Truck, ArrowRight, ArrowLeft } from 'lucide-react';
import { getUserOrders } from '@/lib/supabase/orders';
import { Order } from '@/types/database';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderNumber = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const orders = await getUserOrders();
      const match = orders.find(
        (o) => o.order_number === orderNumber || o.id === orderNumber
      );
      if (match) {
        setOrder(match);
      }
      setLoading(false);
    }
    load();
  }, [orderNumber]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Confirmation Hero */}
      <div className="bg-white p-8 sm:p-12 border border-stone-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-800">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-800">
            Order Confirmed & Placed
          </span>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black uppercase tracking-tight text-stone-950">
            Thank you for your order
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            An order confirmation and shipment tracking link will be sent to your email.
          </p>
        </div>

        {/* Order Details Badge */}
        <div className="bg-stone-50 p-4 border border-stone-200 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-700 gap-2">
          <div>
            <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Order Identifier</span>
            <span className="font-mono font-bold text-stone-950 text-sm">{order?.order_number || orderNumber}</span>
          </div>
          <div>
            <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Status</span>
            <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
              {order?.status || 'Confirmed'}
            </span>
          </div>
          <div>
            <span className="text-stone-400 uppercase tracking-wider text-[10px] block">Payment Method</span>
            <span className="font-semibold text-stone-900">{order?.payment_method || 'Cash on Delivery'}</span>
          </div>
        </div>

        {/* Shipping summary */}
        {order && (
          <div className="text-left bg-white border border-stone-100 p-4 space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-800" />
              <span>Delivery Coordinates</span>
            </h3>
            <p className="text-stone-700">
              <strong>{order.shipping_full_name}</strong> • {order.shipping_phone}
            </p>
            <p className="text-stone-500">
              {order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}
            </p>

            {/* Item summary */}
            {order.items && order.items.length > 0 && (
              <div className="pt-3 border-t border-stone-100 divide-y divide-stone-100">
                {order.items.map((it) => (
                  <div key={it.id} className="py-2 flex justify-between text-xs">
                    <div>
                      <p className="font-semibold text-stone-900">{it.product_name}</p>
                      <p className="text-[11px] text-stone-500">
                        Size: {it.size} | Color: {it.color} | Qty: {it.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-stone-950">₹{it.total_price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-stone-200 flex justify-between font-bold text-stone-950 text-sm">
              <span>Grand Total</span>
              <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href="/shop"
            className="px-6 py-3 bg-stone-950 text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/orders"
            className="px-6 py-3 border border-stone-300 text-stone-800 text-xs font-bold uppercase tracking-[0.2em] hover:bg-stone-100 transition flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>View All Orders</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
