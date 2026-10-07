import { createClient } from "./client";

export type RestaurantScheduleDay = {
  open: string;
  close: string;
};

export type RestaurantSchedule = {
  monday: RestaurantScheduleDay | null;
  tuesday: RestaurantScheduleDay | null;
  wednesday: RestaurantScheduleDay | null;
  thursday: RestaurantScheduleDay | null;
  friday: RestaurantScheduleDay | null;
  saturday: RestaurantScheduleDay | null;
  sunday: RestaurantScheduleDay | null;
};

export type SpecialClosure = {
  active: boolean;
  reason: string | null;
  message: string | null;
  starts_at: string | null;
  ends_at: string | null;
};

export type RestaurantSettings = {
  timezone: string;
  schedule: RestaurantSchedule;
  special_closure: SpecialClosure;
};

export async function getRestaurantSettings(): Promise<RestaurantSettings | null> {
  const supabase = createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  console.log("SUPABASE RESTAURANT DEBUG:", {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSession: Boolean(session),
    userId: session?.user?.id ?? null,
    userEmail: session?.user?.email ?? null,
    sessionError,
  });

  const {
    data,
    error,
  } = await supabase
    .from("site_settings")
    .select("key, value_json")
    .eq("key", "restaurant")
    .maybeSingle();

  console.log("RESTAURANT SETTINGS QUERY:", {
    data,
    error,
  });

  if (error) {
    console.error(
      "Error loading restaurant settings:",
      error
    );

    throw error;
  }

  if (!data) {
    console.error(
      "Restaurant settings returned no row."
    );

    return null;
  }

  return data.value_json as RestaurantSettings;
}