import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mockMyItems, type RentalItem, type RentalHistory } from './mockData';
import { Star, MapPin, Phone, Plus, Edit, Trash2, Calendar, User } from 'lucide-react';
import { UserApi } from '../utils/api';
import { toast } from 'sonner';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'rentalProgress';

interface DashboardPageProps {
  onNavigate: (page: Page) => void;
  onOpenRental?: (id: string) => void;
}

export function DashboardPage({ onNavigate, onOpenRental }: DashboardPageProps) {
  const [myItems, setMyItems] = useState<RentalItem[]>(mockMyItems);
  const [history, setHistory] = useState<RentalHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const res = await UserApi.rentals();
      if (!res.ok) {
        toast.error(res.error || 'Failed to load rentals');
        setLoading(false);
        return;
      }
      if (!isMounted) return;
      const mapped: RentalHistory[] = res.data?.rentals.map(r => ({
        id: String(r.id),
        itemName: r.itemId,
        itemImage: '',
        status: r.status,
        type: (r.type as any) || 'Rented',
        rentalDates: new Date(r.createdAt).toLocaleDateString(),
        otherParty: 'Owner',
        pricePerDay: 0,
      })) || [];
      setHistory(mapped);
      setLoading(false);
    })();
    return () => { isMounted = false; };
  }, []);

  const handleDeleteItem = (itemId: string) => {
    setMyItems(prev => prev.filter(item => item.id !== itemId));
  };

  const MyItemCard = ({ item }: { item: RentalItem }) => (
    <Card className="hover:shadow-lg transition-shadow border-0 shadow-md">
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm text-muted-foreground">{item.rating}</span>
          </div>
        </div>
        <Badge variant="secondary" className="w-fit">
          {item.category}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-600">
              ${item.pricePerDay}
              <span className="text-sm font-normal text-muted-foreground">/day</span>
            </span>
            <span className="text-sm text-muted-foreground">{item.availableDates}</span>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => {
            try { localStorage.setItem('edit_item_id', item.id); } catch {}
            onNavigate('editItem' as any);
          }}>
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-destructive hover:text-destructive"
            onClick={() => handleDeleteItem(item.id)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const HistoryCard = ({ history }: { history: RentalHistory }) => (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => { onOpenRental && onOpenRental(history.id); onNavigate('rentalProgress'); }}>
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={history.itemImage || 'https://via.placeholder.com/80x80?text=Item'}
              alt={history.itemName}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{history.itemName}</h3>
              <div className="flex space-x-2">
                <Badge 
                  variant={history.status === 'Completed' ? 'secondary' : 'default'}
                  className={history.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' : ''}
                >
                  {history.status}
                </Badge>
                <Badge 
                  variant="outline"
                  className={history.type === 'Lent' ? 'border-blue-200 text-blue-700' : 'border-emerald-200 text-emerald-700'}
                >
                  {history.type}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{history.rentalDates}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>{history.otherParty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">${history.pricePerDay}/day</span>
                {history.status === 'Ongoing' && (
                  <Button size="sm" variant="outline" onClick={(e) => {
                    e.stopPropagation();
                    // simple completion action
                    UserApi.updateRental({ id: parseInt(history.id, 10), status: 'Completed' }).then((res) => {
                      if (res.ok) {
                        setHistory((prev) => prev.map((h) => h.id === history.id ? { ...h, status: 'Completed' } : h));
                      }
                    });
                  }}>Mark as completed</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="space-y-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your items and track your rental activity
          </p>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="my-items" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="my-items">My Items</TabsTrigger>
          <TabsTrigger value="history">Rental History</TabsTrigger>
        </TabsList>

        {/* My Items Tab */}
        <TabsContent value="my-items" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">My Listed Items</h2>
              <p className="text-muted-foreground">Items you've listed for rent</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700" onClick={() => onNavigate('lend')}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          </div>

          {myItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {myItems.map(item => (
                <MyItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No items listed yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start earning by listing items you rarely use. It's easy and free to get started!
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700" onClick={() => onNavigate('lend')}>
                <Plus className="w-4 h-4 mr-2" />
                List Your First Item
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Rental History Tab */}
        <TabsContent value="history" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Rental History</h2>
            <p className="text-muted-foreground">Track your past and ongoing rentals</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse h-24 bg-muted rounded-xl" />
              ))}
            </div>
          ) : history.length > 0 ? (
            <div className="space-y-4">
              {history.map(h => (
                <HistoryCard key={h.id} history={h} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No rental history yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Once you start renting or lending items, your history will appear here.
              </p>
              <Button variant="outline" onClick={() => onNavigate('items')}>
                Browse Items
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}