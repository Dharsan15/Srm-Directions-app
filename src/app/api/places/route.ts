import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Server Client
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !url.startsWith('http')) {
    return null;
  }
  return createClient(url, key);
}

// Map database row to app CampusPlace
interface SupabasePlaceRow {
  id: string;
  name: string;
  category: 'academic' | 'canteen' | 'hostel' | 'gate' | 'amenity';
  latitude: number;
  longitude: number;
  short_description: string;
  floor_or_building: string | null;
  tags: string[] | null;
  popular_items: string[] | null;
  icon_name: string | null;
}

function mapRowToPlace(row: SupabasePlaceRow) {
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

// GET: Fetch all places from Supabase
export async function GET() {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase credentials not configured',
        places: []
      });
    }

    const { data, error } = await supabase
      .from('campus_places')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('API /places GET Supabase error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        places: []
      });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: true,
        source: 'empty',
        places: []
      });
    }

    const places = (data as SupabasePlaceRow[]).map(mapRowToPlace);
    return NextResponse.json({
      success: true,
      source: 'supabase',
      places
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    console.error('API /places GET fatal error:', message);
    return NextResponse.json(
      { success: false, error: message, places: [] },
      { status: 500 }
    );
  }
}

// POST: Insert a new place into Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, latitude, longitude, shortDescription, floorOrBuilding, tags, popularItems, iconName } = body;

    if (!name || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { success: false, error: 'Name, latitude, and longitude are required.' },
        { status: 400 }
      );
    }

    const newId = body.id || `custom-${Date.now()}`;
    const supabase = getServerSupabase();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase credentials not configured on server.' },
        { status: 500 }
      );
    }

    const dbRow = {
      id: newId,
      name: name.trim(),
      category: category || 'amenity',
      latitude: Number(latitude),
      longitude: Number(longitude),
      short_description: shortDescription ? shortDescription.trim() : '',
      floor_or_building: floorOrBuilding?.trim() || null,
      tags: Array.isArray(tags) ? tags : [],
      popular_items: Array.isArray(popularItems) ? popularItems : [],
      icon_name: iconName || 'MapPin',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('campus_places')
      .insert(dbRow)
      .select();

    if (error) {
      console.error('API /places POST Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const createdPlace = data && data[0] ? mapRowToPlace(data[0] as SupabasePlaceRow) : {
      ...body,
      id: newId
    };

    return NextResponse.json({ success: true, place: createdPlace });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    console.error('API /places POST error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT: Update an existing place in Supabase
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json(
        { success: false, error: 'id and updates object are required.' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase credentials not configured on server.' },
        { status: 500 }
      );
    }

    const dbUpdates: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    };

    if (updates.name !== undefined) dbUpdates.name = updates.name.trim();
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.latitude !== undefined) dbUpdates.latitude = Number(updates.latitude);
    if (updates.longitude !== undefined) dbUpdates.longitude = Number(updates.longitude);
    if (updates.shortDescription !== undefined) dbUpdates.short_description = updates.shortDescription ? updates.shortDescription.trim() : '';
    if (updates.floorOrBuilding !== undefined) dbUpdates.floor_or_building = updates.floorOrBuilding?.trim() || null;
    if (updates.tags !== undefined) dbUpdates.tags = Array.isArray(updates.tags) ? updates.tags : [];
    if (updates.popularItems !== undefined) dbUpdates.popular_items = Array.isArray(updates.popularItems) ? updates.popularItems : [];
    if (updates.iconName !== undefined) dbUpdates.icon_name = updates.iconName;

    const { data, error } = await supabase
      .from('campus_places')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('API /places PUT Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const updatedPlace = data && data[0] ? mapRowToPlace(data[0] as SupabasePlaceRow) : null;
    return NextResponse.json({ success: true, place: updatedPlace });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    console.error('API /places PUT error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE: Delete a place by id in Supabase
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'id query parameter is required.' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase credentials not configured on server.' },
        { status: 500 }
      );
    }

    const { error } = await supabase
      .from('campus_places')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('API /places DELETE Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    console.error('API /places DELETE error:', message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
