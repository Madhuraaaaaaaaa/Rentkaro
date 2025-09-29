import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export function SettingsPage() {
  const [mode, setMode] = useState<'light'|'dark'|'system'>('system');
  useEffect(() => {
    try {
      const saved = (localStorage.getItem('theme') as 'light'|'dark'|'system'|null) || 'system';
      setMode(saved);
    } catch {}
  }, []);
  const apply = (val: 'light'|'dark'|'system') => {
    setMode(val);
    try { localStorage.setItem('theme', val); } catch {}
    const root = document.documentElement;
    root.classList.add('theme-anim');
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const shouldDark = val === 'dark' || (val === 'system' && mql.matches);
    root.classList.toggle('dark', shouldDark);
  };
  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Theme</div>
            <div className="text-sm text-muted-foreground">Choose how Rentkaro looks</div>
            <div className="flex gap-2 pt-2">
              <Button variant={mode==='light'?'default':'outline'} onClick={() => apply('light')}>Light</Button>
              <Button variant={mode==='dark'?'default':'outline'} onClick={() => apply('dark')}>Dark</Button>
              <Button variant={mode==='system'?'default':'outline'} onClick={() => apply('system')}>System</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


