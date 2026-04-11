import { createClient } from "@/lib/supabase/server";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dateLimit = thirtyDaysAgo.toISOString();

    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .gte('created_at', dateLimit) 
      .order('created_at', { ascending: false }); 

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
    
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}