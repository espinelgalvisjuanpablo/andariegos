import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminRole = "owner" | "admin" | "employee" | "demo";

export async function getAdminAccess() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const role = ((user.app_metadata?.role || user.user_metadata?.role || "admin") as string).toLowerCase() as AdminRole;
  const normalized: AdminRole = ["owner","admin","employee","demo"].includes(role) ? role : "admin";

  return {
    user,
    role: normalized,
    isFull: normalized === "owner" || normalized === "admin",
    isEmployee: normalized === "employee",
    isDemo: normalized === "demo",
  };
}

export function canAccess(role: AdminRole, section: string) {
  if (role === "owner" || role === "admin") return true;
  if (role === "demo") return true;
  return ["menu","contenido"].includes(section);
}

export function requireSection(role: AdminRole, section: string) {
  if (!canAccess(role, section)) redirect("/admin");
}
