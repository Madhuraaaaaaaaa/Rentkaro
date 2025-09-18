import React from 'react';

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t mt-20">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-emerald-600">Rentkaro</h3>
            <p className="text-sm text-muted-foreground">
              The trusted platform for renting and lending anything you need.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-muted-foreground hover:text-emerald-600 transition-colors">
                Instagram
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Careers</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">Contact Info</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 support@rentkaro.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Rental Street, Share City, SC 12345</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Rentkaro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}