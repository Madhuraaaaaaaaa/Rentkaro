export interface RentalItem {
  id: string;
  name: string;
  image: string;
  pricePerDay: number;
  category: string;
  availableDates: string;
  ownerContact: string;
  ownerAddress: string;
  description: string;
  rating: number;
  ownerId: string;
}

export interface RentalHistory {
  id: string;
  itemName: string;
  itemImage: string;
  pricePerDay: number;
  rentalDates: string;
  status: 'Completed' | 'Ongoing';
  type: 'Rented' | 'Lent';
  otherParty: string;
}

export const mockItems: RentalItem[] = [
  {
    id: '1',
    name: 'Professional DSLR Camera',
    image: 'https://images.unsplash.com/photo-1711289163428-75e546d9ffa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYW1lcmElMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU4MjA0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 45,
    category: 'Electronics',
    availableDates: 'Available Jan 20-30',
    ownerContact: '+91 98765 43210',
    ownerAddress: '123 Film Nagar, Mumbai',
    description: 'Canon EOS R5 with 24-70mm lens. Perfect for events, portraits, and professional photography.',
    rating: 4.9,
    ownerId: 'owner1'
  },
  {
    id: '2',
    name: 'Vintage Evening Dress',
    image: 'https://images.unsplash.com/photo-1613253619224-bf06d60b2833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZHJlc3MlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTgyMDQ2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 25,
    category: 'Clothing',
    availableDates: 'Available Feb 1-15',
    ownerContact: '+91 87654 32109',
    ownerAddress: '456 Fashion Street, Delhi',
    description: '1960s vintage cocktail dress, size 8. Perfect for special occasions and themed events.',
    rating: 4.7,
    ownerId: 'owner2'
  },
  {
    id: '3',
    name: 'Power Drill Set',
    image: 'https://images.unsplash.com/photo-1755168648692-ef8937b7e63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHRvb2xzJTIwZHJpbGx8ZW58MXx8fHwxNzU4MjAwMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 15,
    category: 'Tools',
    availableDates: 'Available now',
    ownerContact: '+91 99887 66554',
    ownerAddress: '789 Workshop Road, Pune',
    description: 'Professional grade cordless drill with complete bit set. Great for home improvement projects.',
    rating: 4.8,
    ownerId: 'owner3'
  },
  {
    id: '4',
    name: 'Classic Literature Collection',
    image: 'https://images.unsplash.com/photo-1680537250732-6835b59c937e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGxpYnJhcnklMjBzdGFja3xlbnwxfHx8fDE3NTgyMDQ2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 8,
    category: 'Books',
    availableDates: 'Available Feb 5-28',
    ownerContact: '+91 91234 56780',
    ownerAddress: '321 Library Lane, Kolkata',
    description: 'Complete set of Shakespeare, Dickens, and other classics. Perfect for literature students.',
    rating: 4.6,
    ownerId: 'owner4'
  },
  {
    id: '5',
    name: 'Gaming Laptop',
    image: 'https://images.unsplash.com/photo-1711289163428-75e546d9ffa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYW1lcmElMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU4MjA0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 35,
    category: 'Electronics',
    availableDates: 'Available Jan 25-Feb 5',
    ownerContact: '+91 90909 80807',
    ownerAddress: '654 Tech Park, Bengaluru',
    description: 'High-performance gaming laptop with RTX graphics. Perfect for gaming, video editing, and more.',
    rating: 4.9,
    ownerId: 'owner5'
  },
  {
    id: '6',
    name: 'Designer Handbag',
    image: 'https://images.unsplash.com/photo-1613253619224-bf06d60b2833?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwZHJlc3MlMjBjbG90aGluZ3xlbnwxfHx8fDE3NTgyMDQ2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 20,
    category: 'Accessories',
    availableDates: 'Available now',
    ownerContact: '+91 98111 22233',
    ownerAddress: '987 Luxury Lane, Mumbai',
    description: 'Authentic designer handbag, perfect for special occasions and events.',
    rating: 4.8,
    ownerId: 'owner6'
  }
];

export const mockMyItems: RentalItem[] = [
  {
    id: 'my1',
    name: 'Mountain Bike',
    image: 'https://images.unsplash.com/photo-1755168648692-ef8937b7e63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHRvb2xzJTIwZHJpbGx8ZW58MXx8fHwxNzU4MjAwMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 30,
    category: 'Sports',
    availableDates: 'Available weekends',
    ownerContact: '+1 (555) 999-8888',
    ownerAddress: 'Your Address',
    description: 'Well-maintained mountain bike, perfect for trail adventures.',
    rating: 4.7,
    ownerId: 'you'
  },
  {
    id: 'my2',
    name: 'Wedding Decorations Set',
    image: 'https://images.unsplash.com/photo-1680537250732-6835b59c937e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGxpYnJhcnklMjBzdGFja3xlbnwxfHx8fDE3NTgyMDQ2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 50,
    category: 'Events',
    availableDates: 'Book in advance',
    ownerContact: '+1 (555) 999-8888',
    ownerAddress: 'Your Address',
    description: 'Complete wedding decoration set including centerpieces, lighting, and linens.',
    rating: 5.0,
    ownerId: 'you'
  }
];

export const mockRentalHistory: RentalHistory[] = [
  {
    id: 'h1',
    itemName: 'Professional DSLR Camera',
    itemImage: 'https://images.unsplash.com/photo-1711289163428-75e546d9ffa8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYW1lcmElMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzU4MjA0NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 45,
    rentalDates: 'Jan 15-17, 2025',
    status: 'Completed',
    type: 'Rented',
    otherParty: 'John Photo Studio'
  },
  {
    id: 'h2',
    itemName: 'Power Drill Set',
    itemImage: 'https://images.unsplash.com/photo-1755168648692-ef8937b7e63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHRvb2xzJTIwZHJpbGx8ZW58MXx8fHwxNzU4MjAwMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 15,
    rentalDates: 'Jan 18-20, 2025',
    status: 'Ongoing',
    type: 'Rented',
    otherParty: 'Mike Builder'
  },
  {
    id: 'h3',
    itemName: 'Mountain Bike',
    itemImage: 'https://images.unsplash.com/photo-1755168648692-ef8937b7e63e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHRvb2xzJTIwZHJpbGx8ZW58MXx8fHwxNzU4MjAwMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 30,
    rentalDates: 'Jan 12-14, 2025',
    status: 'Completed',
    type: 'Lent',
    otherParty: 'Sarah Adventure'
  },
  {
    id: 'h4',
    itemName: 'Wedding Decorations Set',
    itemImage: 'https://images.unsplash.com/photo-1680537250732-6835b59c937e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGxpYnJhcnklMjBzdGFja3xlbnwxfHx8fDE3NTgyMDQ2MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    pricePerDay: 50,
    rentalDates: 'Jan 16-18, 2025',
    status: 'Ongoing',
    type: 'Lent',
    otherParty: 'Emma Events'
  }
];

export const categories = [
  'All Categories',
  'Electronics',
  'Clothing',
  'Tools',
  'Books',
  'Sports',
  'Events',
  'Accessories'
];