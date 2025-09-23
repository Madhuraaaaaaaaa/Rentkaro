import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { categories } from './mockData';
import { ItemsApi } from '../utils/api';
import { toast } from 'sonner';

type Page = 'items';

interface EditItemPageProps {
  itemId: string;
  onDone: (goTo: Page) => void;
}

export function EditItemPage({ itemId, onDone }: EditItemPageProps) {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    image: '',
    pricePerDay: '',
    category: 'Electronics',
    availableDates: '',
    ownerContact: '',
    ownerAddress: '',
    description: ''
  });

  useEffect(() => {
    (async () => {
      const idNum = parseInt(itemId, 10);
      if (!isNaN(idNum)) {
        const res = await ItemsApi.get(idNum);
        if (res.ok && res.data?.item) {
          const i = res.data.item;
          setForm({
            name: i.name,
            image: i.image || '',
            pricePerDay: String(i.pricePerDay),
            category: i.category || 'Electronics',
            availableDates: i.availableDates || '',
            ownerContact: i.ownerContact || '',
            ownerAddress: i.ownerAddress || '',
            description: i.description || ''
          });
        }
      }
      setLoading(false);
    })();
  }, [itemId]);

  const isValid = form.name && form.image && form.pricePerDay;

  const handleSave = async () => {
    const idNum = parseInt(itemId, 10);
    if (isNaN(idNum)) return;
    const res = await ItemsApi.update(idNum, {
      name: form.name,
      image: form.image,
      pricePerDay: Number(form.pricePerDay),
      category: form.category,
      availableDates: form.availableDates,
      ownerContact: form.ownerContact,
      ownerAddress: form.ownerAddress,
      description: form.description,
    });
    if (!res.ok) {
      toast.error(res.error || 'Failed to update item');
      return;
    }
    toast.success('Item updated');
    onDone('items');
  };

  if (loading) return <div className="container max-w-3xl mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Item</h1>
      <Card className="border-0 shadow-md">
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Item name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price per day ($)</label>
              <Input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(c => c !== 'All Categories').map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Available dates</label>
              <Input value={form.availableDates} onChange={(e) => setForm({ ...form, availableDates: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Owner contact</label>
              <Input value={form.ownerContact} onChange={(e) => setForm({ ...form, ownerContact: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Owner address</label>
              <Input value={form.ownerAddress} onChange={(e) => setForm({ ...form, ownerAddress: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button disabled={!isValid} onClick={handleSave}>Save Changes</Button>
            <Button variant="outline" onClick={() => onDone('items')}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


