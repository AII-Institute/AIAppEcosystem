import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseClient, createOnboardingService } from '@ecosystem/core-onboarding';

const APP_ID = 'teachly';

export async function POST(req: NextRequest) {
  const { email, token } = await req.json();
  if (!email || !token)
    return NextResponse.json({ error: 'email and token required' }, { status: 400 });

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

  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Check if MFA elevation is required
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  const mfaRequired = aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2';

  let factorId: string | null = null;
  if (mfaRequired) {
    const { data: factors } = await supabase.auth.mfa.listFactors();
    factorId = factors?.totp?.[0]?.id ?? null;
  }

  // Check if user has completed onboarding profile setup
  const svc = createOnboardingService(
    getSupabaseClient(
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    ),
  );
  const userResult = await svc.getUser(email, APP_ID);
  const isExistingUser = userResult.success && userResult.data !== null;

  const response = NextResponse.json({ mfaRequired, factorId, isExistingUser, user: data.user });
  pending.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options as never),
  );
  return response;
}
