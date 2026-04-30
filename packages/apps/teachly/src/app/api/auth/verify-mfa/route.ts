import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseClient, createOnboardingService } from '@ecosystem/core-onboarding';

const APP_ID = 'teachly';

export async function POST(req: NextRequest) {
  const { code, factorId, email } = await req.json();
  if (!code || !factorId)
    return NextResponse.json({ error: 'code and factorId required' }, { status: 400 });

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

  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId,
  });
  if (challengeError) return NextResponse.json({ error: challengeError.message }, { status: 400 });

  const { error } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  let isExistingUser = false;
  if (email) {
    const svc = createOnboardingService(
      getSupabaseClient(
        process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      ),
    );
    const userResult = await svc.getUser(email, APP_ID);
    isExistingUser = userResult.success && userResult.data !== null;
  }

  const response = NextResponse.json({ isExistingUser });
  pending.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options as never),
  );
  return response;
}
