import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActiveBusiness = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  timezone: string;
  whatsapp: string | null;
  role: "owner" | "admin" | "staff" | "finance";
};

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;
type BusinessRelation = {
  id?: string;
  name?: string;
  slug?: string;
  logo_url?: string | null;
  timezone?: string | null;
  whatsapp?: string | null;
  deleted_at?: string | null;
};

function relationOne(value: unknown): BusinessRelation | null {
  if (Array.isArray(value)) return (value[0] as BusinessRelation | undefined) ?? null;
  if (value && typeof value === "object") return value as BusinessRelation;
  return null;
}

/**
 * Resolve the first active business in a single database round-trip.
 *
 * Auth is already refreshed/checked by middleware. RLS remains the real
 * authorization boundary, so we intentionally avoid another auth.getUser()
 * request here. This removes two sequential network calls from every app page.
 */
export async function getActiveBusiness(client?: ServerSupabaseClient): Promise<ActiveBusiness> {
  let supabase: ServerSupabaseClient;
  try {
    supabase = client ?? (await createClient());
  } catch (error) {
    if (error instanceof Error && error.message === "PESANLUNAS_SUPABASE_NOT_CONFIGURED") {
      redirect("/setup");
    }
    throw error;
  }

  const { data: membership, error: membershipError } = await supabase
    .from("business_members")
    .select(`
      business_id,
      role,
      businesses!inner (
        id,
        name,
        slug,
        logo_url,
        timezone,
        whatsapp,
        deleted_at
      )
    `)
    .eq("status", "active")
    .is("businesses.deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(`BUSINESS_MEMBERSHIP_QUERY_FAILED: ${membershipError.message}`);
  }
  if (!membership) redirect("/onboarding");

  const business = relationOne((membership as { businesses?: unknown }).businesses);
  if (!business?.id || !business.name || !business.slug) redirect("/onboarding");

  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    logo_url: business.logo_url ?? null,
    timezone: business.timezone || "Asia/Jakarta",
    whatsapp: business.whatsapp ?? null,
    role: membership.role as ActiveBusiness["role"],
  };
}
