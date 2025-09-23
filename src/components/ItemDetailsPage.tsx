import React, { useEffect, useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mockItems } from './mockData';
import { CalendarDays, Clock, MapPin, Phone, Star, ArrowLeft } from 'lucide-react';
import { formatINR } from '../utils/format';
import { ItemsApi } from '../utils/api';
import { toast } from 'sonner';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'itemDetails';

interface ItemDetailsPageProps {
  itemId: string | null;
  onBack: () => void;
  onNavigate: (page: Page) => void;
}

export function ItemDetailsPage({ itemId, onBack }: ItemDetailsPageProps) {
  const [serverItem, setServerItem] = useState<any | null>(null);
  useEffect(() => {
    (async () => {
      if (!itemId) return;
      const idNum = parseInt(String(itemId), 10);
      if (!isNaN(idNum)) {
        const res = await ItemsApi.get(idNum);
        if (res.ok && res.data?.item) setServerItem(res.data.item);
      }
    })();
  }, [itemId]);
  const item = useMemo(() => {
    if (serverItem) {
      return {
        id: String(serverItem.id),
        name: serverItem.name,
        image: serverItem.image || '',
        pricePerDay: serverItem.pricePerDay,
        category: serverItem.category || 'Misc',
        availableDates: serverItem.availableDates || '',
        ownerContact: serverItem.ownerContact || '',
        ownerAddress: serverItem.ownerAddress || '',
        description: serverItem.description || '',
        rating: serverItem.rating || 5,
      };
    }
    return mockItems.find((i) => i.id === itemId) || mockItems[0];
  }, [serverItem, itemId]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const timeSlots = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00'
  ];

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-6 inline-flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to items
      </button>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
            <ImageWithFallback src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-3xl font-bold text-slate-900">{item.name}</h1>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm text-muted-foreground">{item.rating}</span>
              </div>
            </div>
            <Badge variant="secondary" className="mt-2">{item.category}</Badge>
            <p className="text-muted-foreground mt-4">{item.description}</p>
          </div>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-600">
                  {formatINR(item.pricePerDay * 83)}
                  <span className="text-sm font-normal text-muted-foreground">/day</span>
                </span>
                <span className="text-sm text-muted-foreground flex items-center">
                  <CalendarDays className="w-4 h-4 mr-1" /> {item.availableDates}
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-muted-foreground flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> {item.ownerAddress}
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Phone className="w-4 h-4 mr-2" /> {item.ownerContact}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-semibold">Book this item</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium mb-2">Choose date</label>
                  <input type="date" className="w-full border rounded-md px-3 py-2" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time slot</label>
                  <select className="w-full border rounded-md px-3 py-2" value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
                    <option value="">Select a slot</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button disabled={!selectedDate || !selectedSlot} className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700" onClick={() => {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                cart.push({ itemId: item.id, name: item.name, image: item.image, pricePerDayINR: item.pricePerDay * 83, date: selectedDate, slot: selectedSlot });
                localStorage.setItem('cart', JSON.stringify(cart));
                try { window.dispatchEvent(new Event('cart-updated')); } catch {}
                toast.success('Added to cart');
              }}>
                <Clock className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


