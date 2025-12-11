import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET /api/test-supabase
 * Test Supabase connection and fetch users
 * Supports both SUPABASE_URL/SUPABASE_ANON_KEY and NEXT_PUBLIC_* variants
 */
export async function GET() {
  try {
    // Check if Supabase is configured (support both naming conventions)
    const supabaseUrl = 
      process.env.SUPABASE_URL || 
      process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    const supabaseAnonKey = 
      process.env.SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          message: 'Please set SUPABASE_URL/SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local',
          configured: false,
        },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Fetch profiles (public table)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(100);

    // Try to fetch users from auth.users (requires service role key)
    let users = null;
    let usersError = null;
    
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { data: authData, error: authError } = await adminClient.auth.admin.listUsers();
      users = authData?.users || null;
      usersError = authError?.message || null;
    }

    return NextResponse.json({
      success: true,
      configured: true,
      supabaseUrl: supabaseUrl.replace(/\/$/, ''),
      data: {
        profiles: {
          data: profiles || [],
          error: profilesError?.message || null,
          count: profiles?.length || 0,
        },
        users: {
          data: users || [],
          error: usersError || (serviceRoleKey ? null : 'SUPABASE_SERVICE_ROLE_KEY not configured'),
          count: users?.length || 0,
          note: serviceRoleKey 
            ? 'Users retrieved from auth.users using service role key' 
            : 'To fetch auth.users, set SUPABASE_SERVICE_ROLE_KEY in .env.local',
        },
      },
    });
  } catch (error) {
    console.error('Supabase connection error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        configured: !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL),
      },
      { status: 500 }
    );
  }
}

