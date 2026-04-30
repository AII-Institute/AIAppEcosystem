import { createClient } from '@supabase/supabase-js';

export const RP_ID = process.env.NEXT_PUBLIC_RP_ID ?? 'localhost';
export const RP_NAME = 'Teachly';
export const EXPECTED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3010';

export function db() {
  return createClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  );
}

export function adminDb() {
  return createClient(
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}

export async function saveChallenge(email: string, challenge: string) {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  await db().from('passkey_challenges').delete().eq('email', email); // clear old ones
  await db().from('passkey_challenges').insert({ email, challenge, expires_at: expiresAt });
}

export async function consumeChallenge(email: string): Promise<string | null> {
  const { data } = await db()
    .from('passkey_challenges')
    .select('id, challenge, expires_at')
    .eq('email', email)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  if (new Date(data.expires_at) < new Date()) return null;

  await db().from('passkey_challenges').delete().eq('id', data.id);
  return data.challenge;
}
