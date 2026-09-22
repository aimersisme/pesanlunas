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

export async function getActiveBusiness(): Promise<ActiveBusiness> {
  let supabase;
  try {
    supabase = await createClient();
  } catch (error) {
    if (error instanceof Error && error.message === "PESANLUNAS_SUPABASE_NOT_CONFIGURED") {
      redirect("/setup");
    }
    throw error;
  }

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) redirect("/auth/login");

  const { data: membership, error: membershipError } = await supabase
    .from("business_members")
    .select("business_id, role")
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    throw new Error(`BUSINESS_MEMBERSHIP_QUERY_FAILED: ${membershipError.message}`);
  }
  if (!membership) redirect("/onboarding");

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id,name,slug,logo_url,timezone,whatsapp")
    .eq("id", membership.business_id)
    .is("deleted_at", null)
    .single();

  if (businessError) {
    throw new Error(`BUSINESS_QUERY_FAILED: ${businessError.message}`);
  }
  if (!business) redirect("/onboarding");

  return {
    ...business,
    timezone: business.timezone || "Asia/Jakarta",
    role: membership.role,
  } as ActiveBusiness;
}
