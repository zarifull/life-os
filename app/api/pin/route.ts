import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    const supabase = await createClient();

    // 1. Initialize variables OUTSIDE the blocks so everyone can see them
    let targetPin = "1234"; 
    let source = "default";

    const { data: { user } } = await supabase.auth.getUser();

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

    // 2. The fix: Compare both as Strings to avoid type bugs
    const isValid = String(pin) === String(targetPin);
    console.log("Input:", pin, "Target:", targetPin);
    if (!isValid) {
      return NextResponse.json({ ok: false, source }, { status: 401 });
    }

    return NextResponse.json({ ok: true, source });
  } catch (error) {
    console.error("PIN Route Error:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}