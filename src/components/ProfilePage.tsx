import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

type Page = 'home' | 'items' | 'dashboard' | 'login' | 'signup' | 'lend' | 'cart' | 'itemDetails' | 'profile' | 'settings';

export function ProfilePage() {
  let email = '';
  try { email = JSON.parse(atob((localStorage.getItem('auth_token') || '').split('.')[1] || ''))?.email || ''; } catch {}
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{email || '—'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Member since</div>
              <div className="font-medium">—</div>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}


