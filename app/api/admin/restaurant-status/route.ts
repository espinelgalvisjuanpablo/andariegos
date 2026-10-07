import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";

type ClosureReason =
  | "temporary"
  | "private_event"
  | "admin_decision"
  | "other";

type UpdatePayload = {
  action: "close" | "open";
  reason?: ClosureReason;
  message?: string;
  starts_at?: string;
  ends_at?: string;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY!;

const supabaseAdmin = createSupabaseAdmin(
  supabaseUrl,
  supabaseSecretKey
);

console.log("ADMIN SUPABASE DEBUG:", {
  hasUrl: Boolean(supabaseUrl),
  hasSecretKey: Boolean(supabaseSecretKey),
});
export async function POST(request: Request) {
  try {
    // 1. Verificar que existe una sesión administrativa válida.
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado." },
        { status: 401 }
      );
    }

    // 2. Leer y validar la solicitud.
    const body = (await request.json()) as UpdatePayload;

    if (body.action !== "close" && body.action !== "open") {
      return NextResponse.json(
        { error: "Acción no válida." },
        { status: 400 }
      );
    }

    // 3. Leer la configuración usando el cliente servidor
    //    con privilegios exclusivos del backend.
    const { data: currentSetting, error: readError } =
      await supabaseAdmin
        .from("site_settings")
        .select("value_json")
        .eq("key", "restaurant")
        .maybeSingle();

    if (readError) {
      console.error(
        "Error reading restaurant settings:",
        readError
      );

      return NextResponse.json(
        {
          error:
            "No fue posible leer la configuración del restaurante.",
        },
        { status: 500 }
      );
    }

    if (!currentSetting) {
      return NextResponse.json(
        {
          error:
            "No existe la configuración del restaurante.",
        },
        { status: 404 }
      );
    }

    const current =
      (currentSetting.value_json as Record<string, unknown>) ?? {};

    // 4. ABRIR RESTAURANTE
    if (body.action === "open") {
      const updatedValue = {
        ...current,
        special_closure: {
          active: false,
          reason: null,
          message: null,
          starts_at: null,
          ends_at: null,
        },
      };

      const { error: updateError } =
        await supabaseAdmin
          .from("site_settings")
          .update({
            value_json: updatedValue,
          })
          .eq("key", "restaurant");

      if (updateError) {
        console.error(
          "Error reopening restaurant:",
          updateError
        );

        return NextResponse.json(
          {
            error:
              "No fue posible abrir el restaurante.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "open",
      });
    }

    // 5. CERRAR RESTAURANTE
    if (
      !body.reason ||
      !body.starts_at ||
      !body.ends_at
    ) {
      return NextResponse.json(
        {
          error:
            "El motivo y el periodo de cierre son obligatorios.",
        },
        { status: 400 }
      );
    }

    const startsAt = new Date(body.starts_at);
    const endsAt = new Date(body.ends_at);

    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime())
    ) {
      return NextResponse.json(
        {
          error:
            "Las fechas del cierre no son válidas.",
        },
        { status: 400 }
      );
    }

    if (endsAt <= startsAt) {
      return NextResponse.json(
        {
          error:
            "La hora de reapertura debe ser posterior al inicio del cierre.",
        },
        { status: 400 }
      );
    }

    const updatedValue = {
      ...current,
      special_closure: {
        active: true,
        reason: body.reason,
        message: body.message?.trim() || null,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
      },
    };

    const { error: updateError } =
      await supabaseAdmin
        .from("site_settings")
        .update({
          value_json: updatedValue,
        })
        .eq("key", "restaurant");

    if (updateError) {
      console.error(
        "Error closing restaurant:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "No fue posible cerrar el restaurante.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: "close",
      special_closure:
        updatedValue.special_closure,
    });
  } catch (error) {
    console.error(
      "Unexpected restaurant status error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Ocurrió un error inesperado.",
      },
      { status: 500 }
    );
  }
}