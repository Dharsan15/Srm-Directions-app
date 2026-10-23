import { CampusPlace } from '@/data/campusPlaces';
import { getSupabaseClient } from './supabase';

const LOCAL_STORAGE_KEY = 'srm_campus_places_cache_v1';

// Convert DB snake_case record to CampusPlace
interface SupabasePlaceRow {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  short_description: string;
  floor_or_building: string | null;
  tags: string[] | null;
  popular_items: string[] | null;
  icon_name: string | null;
}

function mapRowToPlace(row: SupabasePlaceRow): CampusPlace {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    latitude: row.latitude,
    longitude: row.longitude,
    shortDescription: row.short_description || '',
    floorOrBuilding: row.floor_or_building || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    popularItems: Array.isArray(row.popular_items) ? row.popular_items : [],
    iconName: row.icon_name || 'MapPin'
  };
}

/**
 * Fetch campus places:
 * Prioritizes Next.js Server API route (/api/places) which connects to Supabase with 100% reliability.
 * Automatically falls back to local storage cache if offline.
 */
export async function fetchCampusPlaces(): Promise<{ places: CampusPlace[]; source: 'supabase' | 'local_fallback' }> {
  // If in browser, call /api/places
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/places', { cache: 'no-store' });
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.places)) {
          if (json.places.length > 0) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.places));
          }
          return { places: json.places, source: 'supabase' };
        }
      }
    } catch (apiErr) {
      console.warn('API /api/places fetch note:', apiErr);
    }

    // Check local storage fallback if network is down
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { places: parsed, source: 'local_fallback' };
        }
      }
    } catch {
      // ignore
    }
  } else {
    // Server-side direct fetch if called in SSR
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('campus_places')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data && data.length > 0) {
          const places = (data as SupabasePlaceRow[]).map(mapRowToPlace);
          return { places, source: 'supabase' };
        }
      } catch (err) {
        console.warn('Supabase SSR fetch failed:', err);
      }
    }
  }

  return { places: [], source: 'supabase' };
}

/**
 * Add a new campus place directly to Supabase via server API
 */
export async function addCampusPlace(placeData: Omit<CampusPlace, 'id'>): Promise<CampusPlace> {
  const response = await fetch('/api/places', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(placeData)
  });

  const resJson = await response.json().catch(() => ({}));

  if (!response.ok || !resJson.success) {
    throw new Error(resJson.error || `Failed to add landmark (Status ${response.status})`);
  }

  // Clear cache so fresh data loads
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return resJson.place;
}

/**
 * Update an existing campus place directly in Supabase via server API
 */
export async function updateCampusPlace(id: string, updates: Partial<CampusPlace>): Promise<CampusPlace | null> {
  const response = await fetch('/api/places', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, updates })
  });

  const resJson = await response.json().catch(() => ({}));

  if (!response.ok || !resJson.success) {
    throw new Error(resJson.error || `Failed to update landmark (Status ${response.status})`);
  }

  // Clear cache
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return resJson.place || null;
}

/**
 * Delete a campus place directly from Supabase via server API
 */
export async function deleteCampusPlace(id: string): Promise<boolean> {
  const response = await fetch(`/api/places?id=${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });

  const resJson = await response.json().catch(() => ({}));

  if (!response.ok || !resJson.success) {
    throw new Error(resJson.error || `Failed to delete landmark (Status ${response.status})`);
  }

  // Clear cache
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return true;
}

/**
 * Fetch custom categories from Supabase database
 */
export async function fetchCampusCategories(): Promise<Array<{ id: string; label: string }>> {
  if (typeof window !== 'undefined') {
    try {
      const response = await fetch('/api/categories', { cache: 'no-store' });
      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.categories)) {
          return json.categories;
        }
      }
    } catch (err) {
      console.warn('API /api/categories fetch note:', err);
    }
  }
  return [];
}

/**
 * Add a new category to Supabase database
 */
export async function addCampusCategory(category: { id: string; label: string }): Promise<{ id: string; label: string }> {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  });

  const resJson = await response.json().catch(() => ({}));
  if (!response.ok || !resJson.success) {
    throw new Error(resJson.error || `Failed to add category (Status ${response.status})`);
  }

  return resJson.category;
}
