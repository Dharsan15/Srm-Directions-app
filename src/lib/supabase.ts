import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Supports both publishable key (recommended by latest Supabase) and legacy anon key
const supabaseKey = 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseKey !== 'your-supabase-publishable-key-here' &&
    supabaseKey !== 'your-supabase-anon-key-here'
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance && supabaseUrl && supabaseKey) {
    clientInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return clientInstance;
};

export interface AdminUserRecord {
  id: string;
  username: string;
  role: string;
}

// Option 2: Table-based Admin Authentication via `admin_users` table in Supabase
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<{ success: boolean; user?: AdminUserRecord; error?: string }> {
  const cleanUsername = username.trim();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    return { success: false, error: 'Username and password are required.' };
  }

  // If in browser, call server route /api/admin/login for secure and reliable verification
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password: cleanPassword })
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        return { success: true, user: data.user };
      }
      if (!res.ok && data.error) {
        return { success: false, error: data.error };
      }
    } catch {
      // Fallback if network issue
    }
  }

  // Fallback direct check for default admin credentials
  if (cleanUsername.toLowerCase() === 'admin' && cleanPassword === 'srm123') {
    return {
      success: true,
      user: { id: 'default-admin', username: 'admin', role: 'admin' }
    };
  }

  return { success: false, error: 'Invalid username or password.' };
}

// Supabase Auth Helper Functions (Kept for optional Auth features)
export async function signInAdmin(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (email.trim() === 'admin@srmist.edu.in' && password === 'srm123') {
      return { success: true };
    }
    return { success: false, error: 'Supabase is not configured. Please check .env.local.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user ?? undefined };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication failed';
    return { success: false, error: message };
  }
}

export async function signOutAdmin(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }
}

export async function getAdminUser(): Promise<User | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch {
    return null;
  }
}
