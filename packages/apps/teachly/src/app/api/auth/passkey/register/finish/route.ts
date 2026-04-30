import { NextRequest, NextResponse } from 'next/server';
import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { db, RP_ID, EXPECTED_ORIGIN, consumeChallenge } from '@/lib/passkey';

export async function POST(req: NextRequest) {
  const { email, response } = await req.json();
  if (!email || !response)
    return NextResponse.json({ error: 'email and response required' }, { status: 400 });

  const expectedChallenge = await consumeChallenge(email);
  if (!expectedChallenge)
    return NextResponse.json({ error: 'Challenge expired or not found' }, { status: 400 });

  let verification;
  try {
    verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: EXPECTED_ORIGIN,
      expectedRPID: RP_ID,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  if (!verification.verified || !verification.registrationInfo) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }

  const { credential } = verification.registrationInfo;

  const { error } = await db()
    .from('passkey_credentials')
    .upsert(
      {
        email,
        credential_id: credential.id,
        public_key: Buffer.from(credential.publicKey).toString('base64'),
        counter: credential.counter,
        device_type: verification.registrationInfo.credentialDeviceType,
        backed_up: verification.registrationInfo.credentialBackedUp,
        transports: response.response.transports ?? [],
      },
      { onConflict: 'credential_id' },
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ verified: true });
}
