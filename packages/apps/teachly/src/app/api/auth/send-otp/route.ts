import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getSupabaseClient, createOnboardingService } from '@ecosystem/core-onboarding';

const APP_ID = 'teachly';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  // Send OTP via Supabase Auth
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

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  // Check if user has completed onboarding before (so UI can tailor copy)
  const svc = createOnboardingService(
    getSupabaseClient(
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    ),
  );
  const userResult = await svc.getUser(email, APP_ID);
  const isExistingUser = userResult.success && userResult.data !== null;

  const response = NextResponse.json({ isExistingUser });
  pending.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options as never),
  );
  return response;
}
