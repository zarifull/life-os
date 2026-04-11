import { createClient } from "@/lib/supabase/server";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 1. Set the 30-day window
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // We use ISO string because created_at is a 'timestamptz' type
    const dateLimit = thirtyDaysAgo.toISOString();

    // 2. Query using 'created_at' (matches your screenshot)
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .gte('created_at', dateLimit) 
      .order('created_at', { ascending: false }); // Sort by newest created_at

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
    
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}