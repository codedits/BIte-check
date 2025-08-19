export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  location: string;
  cuisine: string;
  priceRange: string;
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Sakura Sushi',
    description: 'Authentic Japanese sushi and sashimi with fresh ingredients flown in daily from Tokyo.',
    image: '/api/placeholder/400/300',
    rating: 4.8,
    location: 'Downtown District',
    cuisine: 'Japanese',
    priceRange: '$$$'
  },
  {
    id: '2',
    name: 'Trattoria Bella',
    description: 'Family-owned Italian restaurant serving homemade pasta and wood-fired pizzas.',
    image: '/api/placeholder/400/300',
    rating: 4.6,
    location: 'Little Italy',
    cuisine: 'Italian',
    priceRange: '$$'
  },
  {
    id: '3',
    name: 'Le Petit Bistro',
    description: 'French bistro offering classic dishes like coq au vin and beef bourguignon.',
    image: '/api/placeholder/400/300',
    rating: 4.7,
    location: 'Riverside',
    cuisine: 'French',
    priceRange: '$$$'
  },
  {
    id: '4',
    name: 'Spice Garden',
    description: 'Modern Indian cuisine with a fusion twist, featuring aromatic spices and bold flavors.',
    image: '/api/placeholder/400/300',
    rating: 4.5,
    location: 'Cultural Quarter',
    cuisine: 'Indian',
    priceRange: '$$'
  },
  {
    id: '5',
    name: 'Ocean Blue',
    description: 'Seafood restaurant specializing in fresh catches and sustainable fishing practices.',
    image: '/api/placeholder/400/300',
    rating: 4.9,
    location: 'Harbor View',
    cuisine: 'Seafood',
    priceRange: '$$$$'
  },
  {
    id: '6',
    name: 'Taco Libre',
    description: 'Authentic Mexican street food with homemade tortillas and fresh salsas.',
    image: '/api/placeholder/400/300',
    rating: 4.4,
    location: 'Market Square',
    cuisine: 'Mexican',
    priceRange: '$'
  }
];
