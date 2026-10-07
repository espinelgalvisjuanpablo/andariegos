import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SECRET_KEY!);

export async function GET(){
  const [{data:products,error:pError},{data:categories,error:cError},{data:stored}]=await Promise.all([
    db.from("products").select("*,categories(id,slug,name_es,name_en)").neq("status","hidden").order("sort_order",{ascending:true}),
    db.from("categories").select("*").eq("active",true).order("sort_order",{ascending:true}),
    db.from("site_settings").select("value_json").eq("key","inventory").maybeSingle()
  ]);
  if(pError||cError)return NextResponse.json({error:"No fue posible cargar el menú."},{status:500});
  const inventory=(stored?.value_json as any[])||[];
  const now=Date.now();
  const exhausted=new Set(inventory.filter(x=>Number(x.quantity)<=0&&(!x.soldout_until||new Date(x.soldout_until).getTime()>now)).map(x=>String(x.ingredient_id||x.id)));
  let finalProducts=products||[];
  if(exhausted.size){
    const {data:links}=await db.from("product_ingredients").select("product_id,ingredient_id");
    const blocked=new Set((links||[]).filter((x:any)=>exhausted.has(String(x.ingredient_id))).map((x:any)=>String(x.product_id)));
    finalProducts=finalProducts.map((p:any)=>blocked.has(String(p.id))?{...p,status:"soldout"}:p);
  }
  return NextResponse.json({products:finalProducts,categories:categories||[]},{headers:{"Cache-Control":"no-store"}});
}
