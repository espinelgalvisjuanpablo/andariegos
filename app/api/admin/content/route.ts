import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);

async function user(){const s=await sessionClient();const {data:{user}}=await s.auth.getUser();return user}

export async function GET(){
 const u=await user(); if(!u)return NextResponse.json({error:"No autorizado."},{status:401});
 const {data,error}=await db.from("site_settings").select("value_json").eq("key","page_content").maybeSingle();
 if(error)return NextResponse.json({error:"No fue posible cargar el contenido."},{status:500});
 return NextResponse.json({content:data?.value_json||{highlights:[],home:{}}});
}

export async function POST(request:Request){
 const u=await user(); if(!u)return NextResponse.json({error:"No autorizado."},{status:401});
 const role=((u.app_metadata?.role||u.user_metadata?.role||"admin") as string).toLowerCase();
 if(!["owner","admin","employee"].includes(role))return NextResponse.json({error:"No autorizado."},{status:403});
 const body=await request.json();
 const {error}=await db.from("site_settings").upsert({key:"page_content",value_json:body},{onConflict:"key"});
 if(error)return NextResponse.json({error:"No fue posible guardar el contenido."},{status:500});
 return NextResponse.json({success:true});
}
