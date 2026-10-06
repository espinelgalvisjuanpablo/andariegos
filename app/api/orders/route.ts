import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_phone,
      delivery_type,
      address,
      address_reference,
      payment_method_id,
      cash_change_for_cop,
      subtotal_cop,
      delivery_fee_cop,
      total_cop,
      notes,
      items,
    } = body;

    if (
      !customer_name ||
      !customer_phone ||
      !delivery_type ||
      !payment_method_id ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Faltan datos obligatorios para crear el pedido.",
        },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } =
      await supabase
        .from("orders")
        .insert({
          customer_name,
          customer_phone,
          delivery_type,
          address:
            delivery_type === "delivery"
              ? address
              : null,
          address_reference:
            delivery_type === "delivery"
              ? address_reference || null
              : null,
          payment_method_id,
          cash_change_for_cop:
            cash_change_for_cop || null,
          subtotal_cop,
          delivery_fee_cop,
          total_cop,
          notes: notes || null,
        })
        .select("id, order_number")
        .single();

    if (orderError) {
      console.error(
        "Error creating order:",
        orderError
      );

      return NextResponse.json(
        {
          error:
            "No fue posible guardar el pedido.",
        },
        { status: 500 }
      );
    }

    const orderItems = items.map(
      (item: {
        product_id: string;
        product_name_es: string;
        product_name_en: string;
        unit_price_cop: number;
        quantity: number;
      }) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name_es: item.product_name_es,
        product_name_en: item.product_name_en,
        unit_price_cop: item.unit_price_cop,
        quantity: item.quantity,
        line_total_cop:
          item.unit_price_cop * item.quantity,
      })
    );

    const { error: itemsError } =
      await supabase
        .from("order_items")
        .insert(orderItems);

    if (itemsError) {
      console.error(
        "Error creating order items:",
        itemsError
      );

      await supabase
        .from("orders")
        .delete()
        .eq("id", order.id);

      return NextResponse.json(
        {
          error:
            "No fue posible guardar los productos del pedido.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_number: order.order_number,
    });
  } catch (error) {
    console.error(
      "Unexpected order error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ocurrió un error inesperado al crear el pedido.",
      },
      { status: 500 }
    );
  }
}