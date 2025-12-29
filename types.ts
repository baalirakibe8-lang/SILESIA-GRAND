
export interface Room {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  image: string;
  gallery: string[];
  amenities: string[];
  features: string[];
}

export interface Amenity {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface UserImage {
  id: string;
  url: string;
  rating: number;
  isFavorite: boolean;
  timestamp: number;
}
