import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);
export async function GET(){
 const {data,error}=await db.from("site_settings").select("value_json").eq("key","page_content").maybeSingle();
 if(error)return NextResponse.json({error:"No fue posible cargar el contenido."},{status:500});
 const value=(data?.value_json as any)||{highlights:[],home:{}};
 const now=Date.now();
 value.highlights=(value.highlights||[]).filter((x:any)=>x.status==="published"||x.status==="scheduled"&&(x.publish_at&&new Date(x.publish_at).getTime()<=now));
 return NextResponse.json({content:value},{headers:{"Cache-Control":"no-store"}});
}
