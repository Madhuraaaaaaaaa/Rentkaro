import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { formatINR } from '../utils/format';
import { UserApi } from '../utils/api';
import { toast } from 'sonner';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'lend' | 'cart' | 'itemDetails';

interface CartPageProps {
  onNavigate: (page: Page) => void;
}

export function CartPage({ onNavigate }: CartPageProps) {
  const [cart, setCart] = useState<any[]>([]);
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem('cart') || '[]')); } catch { setCart([]); }
  }, []);

  const subtotal = cart.reduce((s, i) => s + (i.pricePerDayINR || 0), 0);
  const discount = coupon.trim().toUpperCase() === 'SAVE10' ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  const proceedToPay = async () => {
    if (!cart.length) return;
    const amount = total;
    const payment = await UserApi.pay(amount);
    if (!payment.ok) {
      toast.error(payment.error || 'Payment failed');
      return;
    }
    // Create rentals for each cart item
    for (const item of cart) {
      await UserApi.createRental({ itemId: String(item.id || item.name), type: 'Rented' });
    }
    toast.success('Order placed successfully');
    const next: any[] = [];
    setCart(next);
    try { localStorage.setItem('cart', JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event('cart-updated'));
  };

  const remove = (idx: number) => {
    const next = cart.filter((_, i) => i !== idx);
    setCart(next);
    localStorage.setItem('cart', JSON.stringify(next));
  };

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <Card key={idx} className="border-0 shadow-md">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.date} • {item.slot}</div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="font-semibold">{formatINR(item.pricePerDayINR)}</div>
                    <Button variant="outline" onClick={() => remove(idx)}>Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="text-emerald-700">{discount ? `- ${formatINR(discount)}` : formatINR(0)}</span>
                </div>
                <div className="border-t pt-6 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
                <div className="flex space-x-2">
                  <input className="border rounded-md px-3 py-2 flex-1" placeholder="Coupon code (e.g., SAVE10)" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                  <Button variant="outline" onClick={() => { /* coupon applied via derived state */ }}>Apply</Button>
                </div>
                <Button onClick={proceedToPay} className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">Proceed to Pay</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}


