import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function POST(req: NextRequest) {
  const pending: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cs) => {
          pending.push(...cs);
        },
      },
    },
  );

  await supabase.auth.signOut();

  const response = NextResponse.json({ ok: true });
  pending.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options as never),
  );
  return response;
}
