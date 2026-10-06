import { createClient } from "./client";

export async function getCategories() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error loading categories:", error);
    throw error;
  }

  return data ?? [];
}

export async function getProducts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (
        id,
        slug,
        name_es,
        name_en
      )
    `)
    .neq("status", "hidden")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error loading products:", error);
    throw error;
  }

  return data ?? [];
}