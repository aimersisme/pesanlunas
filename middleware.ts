import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

const protectedPrefixes = ["/dashboard", "/orders", "/receivables", "/more", "/onboarding", "/customers", "/catalog", "/invoices", "/custom-fields", "/payment-methods", "/message-templates", "/settings", "/team", "/reports", "/activity", "/whatsapp", "/account"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Do not let a missing Vercel env produce a generic 500 on protected pages.
  if (!url || !key) {
    if (path !== "/setup" && !path.startsWith("/api/health")) {
      const setupUrl = request.nextUrl.clone();
      setupUrl.pathname = "/setup";
      setupUrl.search = "";
      return NextResponse.redirect(setupUrl);
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }: CookieToSet) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }: CookieToSet) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  const isProtected = protectedPrefixes.some((prefix: string) => path.startsWith(prefix));
  const shouldRedirectAuthenticatedFromAuth = path === "/auth/login" || path === "/auth/register";

  // If Supabase is temporarily unavailable, avoid a redirect loop. Let the page render its error boundary.
  if (error && isProtected) return response;

  if (isProtected && !data.user) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/auth/login";
    nextUrl.searchParams.set("next", path);
    return NextResponse.redirect(nextUrl);
  }

  if (shouldRedirectAuthenticatedFromAuth && data.user) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/dashboard";
    nextUrl.search = "";
    return NextResponse.redirect(nextUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
