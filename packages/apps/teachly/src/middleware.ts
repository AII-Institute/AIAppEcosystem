import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cs) =>
          cs.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    },
  );

  // Refresh session so it doesn't silently expire
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/parent') ||
    pathname.startsWith('/kids');

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Redirect authenticated users away from onboarding if they already finished it
  // (full onboarding check would need a DB call; redirect happens after OTP verify)

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/parent/:path*', '/kids/:path*'],
};
