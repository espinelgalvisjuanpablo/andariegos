import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);
export async function GET(){
 const {data,error}=await db.from("site_settings").select("key,value_json").in("key",["delivery","whatsapp","reservations","page_content"]);
 if(error)return NextResponse.json({error:"No fue posible cargar la configuración pública."},{status:500});
 return NextResponse.json({settings:Object.fromEntries((data||[]).map(x=>[x.key,x.value_json]))},{headers:{"Cache-Control":"no-store"}});
}
