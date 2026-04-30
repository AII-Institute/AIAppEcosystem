import { createServerClient } from '@supabase/ssr';
import type { NextRequest, NextResponse } from 'next/server';

export function createSupabaseRoute(req: NextRequest, res: NextResponse) {
  const pending: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          pending.push(...cookiesToSet);
        },
      },
    },
  );

  return {
    supabase,
    flushCookies() {
      pending.forEach(({ name, value, options }) => res.cookies.set(name, value, options as never));
    },
  };
}
