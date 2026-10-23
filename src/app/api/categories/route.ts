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

// GET: Fetch all custom categories from Supabase
export async function GET() {
  try {
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({
        success: false,
        error: 'Supabase credentials not configured',
        categories: []
      });
    }

    const { data, error } = await supabase
      .from('campus_categories')
      .select('id, label, created_at')
      .order('label', { ascending: true });

    if (error) {
      console.error('API /categories GET error:', error);
      return NextResponse.json({
        success: false,
        error: error.message,
        categories: []
      });
    }

    return NextResponse.json({
      success: true,
      categories: data || []
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json(
      { success: false, error: message, categories: [] },
      { status: 500 }
    );
  }
}

// POST: Insert a new category into Supabase
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, label } = body;

    if (!id || !label) {
      return NextResponse.json(
        { success: false, error: 'id and label are required' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('campus_categories')
      .upsert({ id: id.trim(), label: label.trim() })
      .select();

    if (error) {
      console.error('API /categories POST error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      category: data && data[0] ? data[0] : { id, label }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
