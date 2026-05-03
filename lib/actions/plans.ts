import { createClient } from '@/lib/supabase/client'; 

export interface Plan {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  target_date: string;
  user_id?: string;
}

const supabase = createClient();


export async function updatePlanStatus(planId: string, completed: boolean) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plans')
    .update({ completed })
    .eq('id', planId)
    .select();

  if (!data || data.length === 0) {
    return { data: null, error: { message: "No rows updated. Check RLS policies." } };
  }

  return { data: data[0], error };
}

export async function createPlan(title: string, time: string, target_date: string) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: { message: "User not authenticated" } };
  }

  const { data, error } = await supabase
    .from('plans')
    .insert([
      { 
        title, 
        time, 
        target_date,
        completed: false,
        user_id: user.id 
      }
    ])
    .select()
    .single();
    
  return { data, error };
}


export async function deletePlanApi(planId: string) {
  const { error } = await supabase
    .from('plans')
    .delete()
    .eq('id', planId);

  return { error };
}

export async function fetchPlansByDate(date: string) {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('target_date', date) 
    .order('time', { ascending: true });

  return { data, error };
}


export async function updatePlanText(planId: string, title: string, time: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('plans')
    .update({ title, time })
    .eq('id', planId)
    .select()
    .single();

  return { data, error };
}