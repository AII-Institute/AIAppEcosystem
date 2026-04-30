import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { createServerClient } from '@supabase/ssr';
import { db, adminDb, RP_ID, EXPECTED_ORIGIN, consumeChallenge } from '@/lib/passkey';

export async function POST(req: NextRequest) {
  const { email, response } = await req.json();
  if (!email || !response)
    return NextResponse.json({ error: 'email and response required' }, { status: 400 });

  // Fetch the stored credential
  const { data: cred } = await db()
    .from('passkey_credentials')
    .select('*')
    .eq('credential_id', response.id)
    .maybeSingle();

  if (!cred) return NextResponse.json({ error: 'Credential not found' }, { status: 404 });

  const expectedChallenge = await consumeChallenge(email);
  if (!expectedChallenge)
    return NextResponse.json({ error: 'Challenge expired or not found' }, { status: 400 });

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: EXPECTED_ORIGIN,
      expectedRPID: RP_ID,
      credential: {
        id: cred.credential_id,
        publicKey: Buffer.from(cred.public_key, 'base64'),
        counter: cred.counter,
        transports: cred.transports ?? [],
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }

  if (!verification.verified) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
  }

  // Update counter to prevent replay attacks
  await db()
    .from('passkey_credentials')
    .update({ counter: verification.authenticationInfo.newCounter })
    .eq('credential_id', cred.credential_id);

  // Create a Supabase Auth session via admin → OTP flow
  const admin = adminDb();
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  if (linkError || !linkData.properties) {
    return NextResponse.json(
      { error: linkError?.message ?? 'Session creation failed' },
      { status: 500 },
    );
  }

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

  const { error: otpError } = await supabase.auth.verifyOtp({
    email,
    token: linkData.properties.email_otp,
    type: 'email',
  });

  if (otpError) return NextResponse.json({ error: otpError.message }, { status: 500 });

  const response2 = NextResponse.json({ verified: true });
  pending.forEach(({ name, value, options }) =>
    response2.cookies.set(name, value, options as never),
  );
  return response2;
}
