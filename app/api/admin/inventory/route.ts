import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createClient as sessionClient } from "@/lib/supabase/server";
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);
const seed=[["Champiñones",7,"unidad"],["Tomates",12,"unidad"],["Cebolla",9,"unidad"],["Ajo",18,"unidad"],["Queso",6,"porción"],["Masa de pizza",10,"unidad"],["Carne",8,"porción"],["Pollo",11,"porción"],["Arroz",9,"porción"],["Fideos",14,"porción"],["Arepas",16,"unidad"],["Papa",24,"unidad"]].map((x,i)=>({id:`seed-${i}`,name_es:x[0],quantity:x[1],unit:x[2],active:true}));
async function auth(){const s=await sessionClient();const {data:{user}}=await s.auth.getUser();return user}
export async function GET(){const u=await auth();if(!u)return NextResponse.json({error:"No autorizado."},{status:401});const {data}=await db.from("site_settings").select("value_json").eq("key","inventory").maybeSingle();return NextResponse.json({items:(data?.value_json as any[])||[]});}
export async function POST(request:Request){const u=await auth();if(!u)return NextResponse.json({error:"No autorizado."},{status:401});const body=await request.json();const items=Array.isArray(body.items)?body.items:seed;const demo=(await cookies()).get("andariegos_demo")?.value==="1";if(demo)return NextResponse.json({success:true,demo:true,items});const {error}=await db.from("site_settings").upsert({key:"inventory",value_json:items},{onConflict:"key"});if(error)return NextResponse.json({error:"No fue posible guardar el inventario."},{status:500});return NextResponse.json({success:true,items});}
