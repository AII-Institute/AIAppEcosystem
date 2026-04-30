import { NextRequest, NextResponse } from 'next/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { db, RP_ID, RP_NAME, saveChallenge } from '@/lib/passkey';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  // Fetch existing credentials so we don't register duplicates
  const { data: existing } = await db()
    .from('passkey_credentials')
    .select('credential_id, transports')
    .eq('email', email);

  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userName: email,
    userDisplayName: email,
    attestationType: 'none',
    excludeCredentials: (existing ?? []).map((c) => ({
      id: c.credential_id,
      transports: c.transports ?? [],
    })),
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
    },
  });

  await saveChallenge(email, options.challenge);

  return NextResponse.json(options);
}
