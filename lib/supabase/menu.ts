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
  const response = await fetch("/api/public/menu", { cache: "no-store" });
  if (!response.ok) throw new Error("Error loading public menu");
  const data = await response.json();
  return data.products ?? [];
}
