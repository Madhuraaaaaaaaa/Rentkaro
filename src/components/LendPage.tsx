import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { categories, type RentalItem } from './mockData';

interface LendPageProps {
  onBack: () => void;
  onAddItem: (item: RentalItem) => void;
}

export function LendPage({ onBack, onAddItem }: LendPageProps) {
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

  const isValid = form.name && form.image && form.pricePerDay && form.availableDates && form.ownerContact && form.ownerAddress;

  const handleSubmit = () => {
    const newItem: RentalItem = {
      id: String(Date.now()),
      name: form.name,
      image: form.image,
      pricePerDay: Number(form.pricePerDay),
      category: form.category,
      availableDates: form.availableDates,
      ownerContact: form.ownerContact,
      ownerAddress: form.ownerAddress,
      description: form.description,
      rating: 5.0,
      ownerId: 'you'
    };
    onAddItem(newItem);
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">← Back</button>
      <h1 className="text-3xl font-bold mb-6">List an Item to Lend</h1>
      <Card className="border-0 shadow-md">
        <CardContent className="p-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Item name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., DSLR Camera" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price per day ($)</label>
              <Input type="number" value={form.pricePerDay} onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
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
              <Input value={form.availableDates} onChange={(e) => setForm({ ...form, availableDates: e.target.value })} placeholder="e.g., Available Feb 10-20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Owner contact</label>
              <Input value={form.ownerContact} onChange={(e) => setForm({ ...form, ownerContact: e.target.value })} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Owner address</label>
              <Input value={form.ownerAddress} onChange={(e) => setForm({ ...form, ownerAddress: e.target.value })} placeholder="123 Main St, City" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Tell renters about your item" />
            </div>
          </div>
          <Button disabled={!isValid} className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700" onClick={handleSubmit}>Add Listing</Button>
        </CardContent>
      </Card>
    </div>
  );
}


