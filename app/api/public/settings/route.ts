import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);
export async function GET(){
 const {data,error}=await db.from("site_settings").select("key,value_json").in("key",["delivery","whatsapp","reservations","page_content"]);
 if(error)return NextResponse.json({error:"No fue posible cargar la configuración pública."},{status:500});
 const raw=Object.fromEntries((data||[]).map(x=>[x.key,x.value_json])); const page=raw.page_content||{}; const now=Date.now(); const highlights=(page.highlights||[]).filter((x:any)=>x.status==="published"||x.status==="scheduled"&&(x.publish_at&&new Date(x.publish_at).getTime()<=now)); const settings={...raw,page_content:{home:page.home||{},footer:page.footer||{},highlights}}; return NextResponse.json({settings},{headers:{"Cache-Control":"no-store"}});
}
