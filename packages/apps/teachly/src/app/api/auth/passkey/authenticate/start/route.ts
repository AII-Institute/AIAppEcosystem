import { NextRequest, NextResponse } from 'next/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { db, RP_ID, saveChallenge } from '@/lib/passkey';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const { data: creds } = await db()
    .from('passkey_credentials')
    .select('credential_id, transports')
    .eq('email', email);

  if (!creds || creds.length === 0) {
    return NextResponse.json({ error: 'No passkeys registered for this email' }, { status: 404 });
  }

  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    allowCredentials: creds.map((c) => ({
      id: c.credential_id,
      transports: c.transports ?? [],
    })),
    userVerification: 'preferred',
  });

  await saveChallenge(email, options.challenge);

  return NextResponse.json(options);
}
