import React from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircle2, Circle, CreditCard, Clock, Undo2, ArrowLeft } from 'lucide-react';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'itemDetails' | 'lend' | 'rentalProgress';

interface RentalProgressPageProps {
  rentalId: string | null;
  onBack: () => void;
}

export function RentalProgressPage({ rentalId, onBack }: RentalProgressPageProps) {
  // For this mock UI, show a linear progress of 4 stages
  const steps = [
    { key: 'slot', label: 'Slot Booked', icon: Clock },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'ongoing', label: 'Ongoing', icon: Circle },
    { key: 'returned', label: 'Returned', icon: Undo2 }
  ];

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <button onClick={onBack} className="mb-6 inline-flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to dashboard
      </button>
      <h1 className="text-2xl font-bold mb-4">Rental Progress</h1>
      <p className="text-sm text-muted-foreground mb-6">Rental ID: {rentalId || 'N/A'}</p>
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="grid gap-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const completed = idx < 2; // mark first two as completed in mock
              return (
                <div key={s.key} className="flex items-center space-x-4">
                  {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={completed ? 'font-medium text-emerald-700' : ''}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


