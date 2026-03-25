import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    const envPin = process.env.LIFEOS_PIN_CODE;

    let supabasePin: string | null = null;
    try {
      const supabase = createSupabaseServerClient();
      const { data } = await supabase
        .from("profiles")
        .select("pin_code")
        .eq("id", 1)
        .maybeSingle();
      if (data?.pin_code && typeof data.pin_code === "string") {
        supabasePin = data.pin_code;
      }
    } catch {
    }

    let source: "env" | "supabase" | "default" = "default";
    let targetPin: string = "1234";

    if (envPin) {
      targetPin = envPin;
      source = "env";
    } else if (supabasePin) {
      targetPin = supabasePin;
      source = "supabase";
    }
    const isValid = typeof pin === "string" && pin === targetPin;

    if (!isValid) {
      return NextResponse.json({ ok: false, source }, { status: 401 });
    }

    return NextResponse.json({ ok: true, source });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}

