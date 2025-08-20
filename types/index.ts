export interface Review {
  _id: string;
  userId: string;
  username: string;
  restaurant: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  images?: string[];
  rating_breakdown?: {
    taste: number;
    presentation: number;
    service: number;
    ambiance: number;
    value: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  _id: string;
  name: string;
  description: string;
  location: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  totalReviews: number;
  image: string;
  imageThumb?: string; // smaller version for list/cards
  imageBlur?: string; // base64 blur placeholder
  featured?: boolean;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
}
