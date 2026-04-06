import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function POST(request: Request) {
  try {
    const { content, type } = await request.json();
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("memories")
      .insert([
        { 
          content, 
          type, 
          user_id: user.id 
        }
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function GET() {
    try {
      const supabase = await createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
      const { data, error } = await supabase
        .from("memories")
        .select("*")
        .eq("user_id", user.id) 
        .order("created_at", { ascending: false }); 
  
      if (error) throw error;
      return NextResponse.json(data);
    } catch (err) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
  }
  export async function PATCH(request: Request) {
    try {
      const { id, content } = await request.json();
      const supabase = await createClient();
  
      const { data, error } = await supabase
        .from('memories')
        .update({ content })
        .eq('id', id)
        .select();
  
      if (error) throw error;
      return NextResponse.json(data[0]);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }
  export async function DELETE(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');
      const supabase = await createClient();
  
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);
  
      if (error) throw error;
      return NextResponse.json({ message: "Deleted" });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
  }