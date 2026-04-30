import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function db() {
  return createClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  );
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ hasPasskey: false });

  const { data } = await db()
    .from('passkey_credentials')
    .select('credential_id, transports')
    .eq('email', email);

  const creds = data ?? [];
  return NextResponse.json({
    hasPasskey: creds.length > 0,
    credentials: creds.map((c) => ({ id: c.credential_id, transports: c.transports ?? [] })),
  });
}
