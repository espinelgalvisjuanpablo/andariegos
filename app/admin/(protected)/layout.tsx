import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminProtectedLayout({children}:{children:React.ReactNode}){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 if(!user)redirect("/admin/login");
 const role=((user.app_metadata?.role||user.user_metadata?.role||"admin") as string).toLowerCase();
 return <><AdminNav/><div className="admin-shell-content">{children}</div></>;
}
