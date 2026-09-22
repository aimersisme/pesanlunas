import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

const protectedPrefixes = ["/dashboard", "/orders", "/receivables", "/more", "/onboarding"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }: CookieToSet) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }: CookieToSet) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix: string) => path.startsWith(prefix));
  const isAuth = path.startsWith("/auth/");

  if (isProtected && !data.user) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/auth/login";
    nextUrl.searchParams.set("next", path);
    return NextResponse.redirect(nextUrl);
  }

  if (isAuth && data.user) {
    const nextUrl = request.nextUrl.clone();
    nextUrl.pathname = "/dashboard";
    nextUrl.search = "";
    return NextResponse.redirect(nextUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
