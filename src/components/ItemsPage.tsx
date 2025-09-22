import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mockItems, categories, type RentalItem } from './mockData';
import { formatINR } from '../utils/format';
import { Star, MapPin, Phone, Search } from 'lucide-react';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'itemDetails';

interface ItemsPageProps {
  onNavigate: (page: Page) => void;
  onOpenItem: (id: string) => void;
  items?: RentalItem[];
}

export function ItemsPage({ onNavigate, onOpenItem, items }: ItemsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceFilter, setPriceFilter] = useState('All Prices');

  const source = items && items.length ? items : mockItems;
  const filteredItems = source.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceFilter === 'Under $20') matchesPrice = item.pricePerDay < 20;
    else if (priceFilter === '$20-$40') matchesPrice = item.pricePerDay >= 20 && item.pricePerDay <= 40;
    else if (priceFilter === 'Over $40') matchesPrice = item.pricePerDay > 40;
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const ItemCard = ({ item }: { item: RentalItem }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md flex flex-col h-full">
      <button className="aspect-square overflow-hidden rounded-t-lg" onClick={() => onOpenItem(item.id)}>
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </button>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-muted-foreground">{item.rating}</span>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          {item.category}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-600">
              {formatINR(item.pricePerDay * 83)}
              <span className="text-sm font-normal text-muted-foreground">/day</span>
            </span>
            <span className="text-sm text-muted-foreground">{item.availableDates}</span>
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{item.ownerAddress}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>{item.ownerContact}</span>
            </div>
          </div>
        </div>
        
        <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 mt-auto" onClick={() => onOpenItem(item.id)}>
          Contact Owner
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Browse Items</h1>
          <p className="text-muted-foreground">
            Discover thousands of items available for rent in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Prices">All Prices</SelectItem>
              <SelectItem value="Under $20">Under $20</SelectItem>
              <SelectItem value="$20-$40">$20 - $40</SelectItem>
              <SelectItem value="Over $40">Over $40</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All Categories' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setSelectedCategory('All Categories');
            setPriceFilter('All Prices');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}