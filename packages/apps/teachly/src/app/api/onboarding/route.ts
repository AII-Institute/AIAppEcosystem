import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient, createOnboardingService } from '@ecosystem/core-onboarding';

const APP_ID = 'teachly';
const FIRST_STEP = 'welcome';

function getService() {
  const url = process.env.SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_ANON_KEY ?? '';
  return createOnboardingService(getSupabaseClient(url, key));
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const svc = getService();
  const userResult = await svc.getUser(email, APP_ID);
  if (!userResult.success)
    return NextResponse.json({ error: userResult.error.message }, { status: 500 });
  if (!userResult.data) return NextResponse.json({ user: null, state: null });

  const stateResult = await svc.getOrCreateState(userResult.data.id, APP_ID, FIRST_STEP);
  if (!stateResult.success)
    return NextResponse.json({ error: stateResult.error.message }, { status: 500 });

  return NextResponse.json({ user: userResult.data, state: stateResult.data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, role, displayName, avatarColor } = body;
  if (!email || !role)
    return NextResponse.json({ error: 'email and role required' }, { status: 400 });

  const svc = getService();

  let userResult = await svc.getUser(email, APP_ID);
  if (!userResult.success)
    return NextResponse.json({ error: userResult.error.message }, { status: 500 });

  if (!userResult.data) {
    userResult = await svc.createUser({ email, appId: APP_ID, role, displayName, avatarColor });
    if (!userResult.success)
      return NextResponse.json({ error: userResult.error.message }, { status: 500 });
  }

  if (!userResult.data)
    return NextResponse.json({ error: 'user not found after create' }, { status: 500 });
  const stateResult = await svc.getOrCreateState(userResult.data.id, APP_ID, FIRST_STEP);
  if (!stateResult.success)
    return NextResponse.json({ error: stateResult.error.message }, { status: 500 });

  return NextResponse.json({ user: userResult.data, state: stateResult.data });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { email, currentStep, status, stepData, completedAt } = body;
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const svc = getService();
  const userResult = await svc.getUser(email, APP_ID);
  if (!userResult.success)
    return NextResponse.json({ error: userResult.error.message }, { status: 500 });
  if (!userResult.data) return NextResponse.json({ error: 'user not found' }, { status: 404 });

  const stateResult = await svc.updateState(userResult.data.id, APP_ID, {
    currentStep,
    status,
    stepData,
    completedAt,
  });
  if (!stateResult.success)
    return NextResponse.json({ error: stateResult.error.message }, { status: 500 });

  return NextResponse.json({ state: stateResult.data });
}
