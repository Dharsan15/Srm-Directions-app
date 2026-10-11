import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || !url.startsWith('http')) {
    return null;
  }
  return createClient(url, key);
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const cleanUsername = (username || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanUsername || !cleanPassword) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required.' },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('id, username, role')
          .eq('username', cleanUsername)
          .eq('password', cleanPassword)
          .maybeSingle();

        if (!error && data) {
          return NextResponse.json({
            success: true,
            user: data
          });
        }
      } catch (dbErr) {
        console.warn('Server admin_users check error:', dbErr);
      }
    }

    // Default fallback check
    if (cleanUsername.toLowerCase() === 'admin' && cleanPassword === 'srm123') {
      return NextResponse.json({
        success: true,
        user: { id: 'default-admin', username: 'admin', role: 'admin' }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid administrator credentials.' },
      { status: 401 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
