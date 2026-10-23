export type PlaceCategory = string;

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

export const CATEGORY_INFO: Record<string, { label: string; icon: string; color: string; description: string }> = {
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

export function getCategoryMeta(category: string): { label: string; icon: string; color: string; description: string } {
  if (!category) {
    return { label: 'General', icon: 'MapPin', color: '#64748b', description: 'Campus location' };
  }
  const key = category.toLowerCase().trim();
  if (CATEGORY_INFO[key]) {
    return CATEGORY_INFO[key];
  }

  // Format custom category (e.g. "sports-complex" -> "Sports Complex")
  const label = category
    .split(/[-_ ]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  const colors = ['#f97316', '#06b6d4', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1', '#10b981'];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];

  return {
    label: label || category,
    icon: 'MapPin',
    color,
    description: `${label} facilities & locations`
  };
}

// Helper to generate Google Maps walking navigation link directly from GPS
export function getGoogleMapsWalkingUrl(lat: number, lng: number, placeName?: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=walking`;
}
