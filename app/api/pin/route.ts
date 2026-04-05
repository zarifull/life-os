import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let targetPin = "1234"; 
    let source = "default";

    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("pin_code")
        .eq("id", user.id) 
        .maybeSingle();

      if (data?.pin_code) {
        targetPin = data.pin_code;
        source = "supabase";
      }
    }

    const envPin = process.env.LIFEOS_PIN_CODE;
    if (source === "default" && envPin) {
      targetPin = envPin;
      source = "env";
    }

    const isValid = pin === targetPin;

    if (!isValid) {
      return NextResponse.json({ ok: false, source }, { status: 401 });
    }

    return NextResponse.json({ ok: true, source });
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}