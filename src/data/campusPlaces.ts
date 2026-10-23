export type PlaceCategory = 'academic' | 'canteen' | 'hostel' | 'gate' | 'amenity';

export interface CampusPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  shortDescription?: string;
  floorOrBuilding?: string;
  tags: string[];
  popularItems?: string[];
  iconName?: string;
}

export const CATEGORY_INFO: Record<PlaceCategory, { label: string; icon: string; color: string; description: string }> = {
  canteen: {
    label: 'Food & Canteens',
    icon: 'Utensils',
    color: '#ff6b6b',
    description: 'Cafes, food courts, snacks & dining halls'
  },
  academic: {
    label: 'Academic Blocks',
    icon: 'GraduationCap',
    color: '#4dabf7',
    description: 'Lecture halls, computing labs & department buildings'
  },
  hostel: {
    label: 'Student Hostels',
    icon: 'Bed',
    color: '#9775fa',
    description: 'Men and women student residences & mess halls'
  },
  gate: {
    label: 'Gates & Transit',
    icon: 'DoorOpen',
    color: '#20c997',
    description: 'Main entrances, train station links & bus bays'
  },
  amenity: {
    label: 'Healthcare & Amenities',
    icon: 'HeartPulse',
    color: '#fcc419',
    description: 'Hospital, library, banking, sports & post office'
  }
};

// Helper to generate Google Maps walking navigation link directly from GPS
export function getGoogleMapsWalkingUrl(lat: number, lng: number, placeName?: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=walking`;
}
