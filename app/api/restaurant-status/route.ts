import { NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { getRestaurantStatus } from "@/lib/supabase/restaurant-status";
import type { RestaurantSettings } from "@/lib/supabase/restaurant";

const admin=createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

export async function GET(){
  try{
    const {data,error}=await admin
      .from("site_settings")
      .select("value_json")
      .eq("key","restaurant")
      .maybeSingle();

    if(error||!data){
      return NextResponse.json(
        {error:"No fue posible cargar el horario."},
        {status:500}
      );
    }

    const settings=data.value_json as RestaurantSettings;
    const status=getRestaurantStatus(settings);

    return NextResponse.json({
      timezone:settings.timezone,
      schedule:settings.schedule,
      status:{
        isOpen:status.isOpen,
        reason:status.reason,
        openingTime:status.openingTime,
        closingTime:status.closingTime,
        overrideEndsAt:status.overrideEndsAt,
        message:status.closureMessage
      }
    },{
      headers:{"Cache-Control":"no-store"}
    });
  }catch(error){
    console.error("Public restaurant status error:",error);
    return NextResponse.json(
      {error:"No fue posible cargar el horario."},
      {status:500}
    );
  }
}
