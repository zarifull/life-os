import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ hasPin: false });

    const { data } = await supabase
      .from("profiles")
      .select("pin_code")
      .eq("id", user.id)
      .maybeSingle();

    return NextResponse.json({ hasPin: !!data?.pin_code });
  } catch (error) {
    console.error("PIN Status Check Error:", error);
    return NextResponse.json({ hasPin: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { ok: false, message: "Session expired or unauthorized" }, 
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("pin_code")
      .eq("id", user.id)
      .maybeSingle();

    const targetPin = profile?.pin_code || process.env.LIFEOS_PIN_CODE || "1234";

    const isValid = String(pin) === String(targetPin);

    if (!isValid) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    
    response.cookies.set('life_os_pin_verified', 'true', {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, 
    });

    return response;

  } catch (error) {
    console.error("PIN Verification Error:", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}