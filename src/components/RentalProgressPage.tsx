import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';
import { CheckCircle2, Circle, CreditCard, Clock, Undo2, ArrowLeft } from 'lucide-react';
import { UserApi } from '../utils/api';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'itemDetails' | 'lend' | 'rentalProgress';

interface RentalProgressPageProps {
  rentalId: string | null;
  onBack: () => void;
}

export function RentalProgressPage({ rentalId, onBack }: RentalProgressPageProps) {
  const [paymentId, setPaymentId] = useState<string | undefined>('');
  const [status, setStatus] = useState<'Completed' | 'Ongoing' | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const id = rentalId ? parseInt(rentalId, 10) : NaN;
      if (!isNaN(id)) {
        const res = await UserApi.rental(id);
        if (res.ok && res.data?.rental) {
          setPaymentId(res.data.rental.paymentId);
          setStatus(res.data.rental.status);
        }
      }
    })();
  }, [rentalId]);
  // For this UI, show a linear progress of 4 stages
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
      <p className="text-sm text-muted-foreground mb-2">Rental ID: {rentalId || 'N/A'}</p>
      {paymentId && <p className="text-sm text-muted-foreground mb-6">Payment: {paymentId}</p>}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="grid gap-6">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const completed = idx < 2 || (status === 'Completed' && idx < 4);
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


