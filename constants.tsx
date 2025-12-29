
import { Room, Amenity } from './types';

export const ROOMS: Room[] = [
  {
    id: 'spodek-suite',
    name: 'The Spodek Panorama Suite',
    description: 'Breathtaking 180-degree views of the legendary Spodek Arena and the International Congress Centre.',
    fullDescription: 'Perched on the 22nd floor, the Spodek Panorama Suite offers an architectural perspective unlike any other in Katowice. The suite features a minimalist modernist design, honoring the city\'s futuristic vision. Guests enjoy a private lounge area, a Bang & Olufsen sound system, and a bathroom clad in dark Silesian slate with a freestanding soaking tub positioned against the window.',
    price: 340,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800'
    ],
    amenities: ['Panoramic View', 'King Bed', 'Personal Butler', 'Champagne Arrival'],
    features: ['65 m²', 'Nespresso Vertuo', 'Smart Glass Privacy', 'Evening Turndown', 'Priority Spa Access']
  },
  {
    id: 'black-diamond-loft',
    name: 'Black Diamond Loft',
    description: 'An homage to Silesia\'s industrial heritage, blending raw materials with supreme luxury.',
    fullDescription: 'The Black Diamond Loft is our signature "Coal to Culture" experience. Featuring original exposed brickwork, black steel accents, and warm oak flooring, this suite captures the soul of Katowice. The centerpiece is a custom-made bed with 800-thread count Egyptian cotton linens and a curated collection of local industrial art.',
    price: 280,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1536376074432-cd229f345330?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800'
    ],
    amenities: ['Industrial Design', 'Loft Layout', 'Vinyl Player', 'Local Craft Gin Bar'],
    features: ['52 m²', 'Marshall Speakers', 'Rainforest Shower', 'Designated Workspace', 'Underfloor Heating']
  },
  {
    id: 'modernist-studio',
    name: 'Modernist Executive Studio',
    description: 'Clean lines and high-tech amenities for the discerning modern traveler.',
    fullDescription: 'Inspired by the Katowice Modernism Trail, this studio offers a highly functional yet elegant space. Perfect for executive stays, it features integrated smart-home controls, an ergonomic workstation with Herman Miller seating, and acoustic insulation for total tranquility in the heart of the city.',
    price: 195,
    image: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&q=80&w=1200',
    gallery: [
      'https://images.unsplash.com/photo-1505693419148-186716a125b2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800'
    ],
    amenities: ['Smart Controls', 'Ergonomic Desk', 'Fiber Internet', 'Quiet Zone'],
    features: ['40 m²', 'Steam Iron', 'Yoga Mat', 'Organic Toiletries', 'Self Check-in Capable']
  }
];

export const AMENITIES: Amenity[] = [
  {
    id: 'deep-spa',
    title: 'The Deep Well Spa',
    description: 'A subterranean sanctuary inspired by ancient salt mines, featuring thermal pools and halotherapy.',
    icon: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
  },
  {
    id: 'hearth-dining',
    title: 'Silesian Hearth',
    description: 'Culinary excellence featuring "Black Gold" pierogi and modern interpretations of beef roulades.',
    icon: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z'
  },
  {
    id: 'culture-concierge',
    title: 'Culture Hub',
    description: 'Direct ticketing for NOSPR concerts and exclusive private tours of Nikiszowiec.',
    icon: 'M21 5h-2.09l-1.07-1.07A1 1 0 0 0 17.13 3.5H6.87a1 1 0 0 0-.71.29L5.09 4.86H3a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-14a1 1 0 0 0-1-1zM12 18a5 5 0 1 1 5-5 5 5 0 0 1-5 5z'
  }
];
