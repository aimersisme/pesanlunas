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
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) redirect("/auth/login");

  const { data: membership } = await supabase
    .from("business_members")
    .select("business_id, role")
    .eq("status", "active")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!membership) redirect("/onboarding");

  const { data: business, error } = await supabase
    .from("businesses")
    .select("id,name,slug,logo_url,timezone,whatsapp")
    .eq("id", membership.business_id)
    .is("deleted_at", null)
    .single();

  if (error || !business) redirect("/onboarding");
  return { ...business, role: membership.role } as ActiveBusiness;
}
