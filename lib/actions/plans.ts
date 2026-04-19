import { createClient } from '@/lib/supabase/client'; 

export interface Plan {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  target_date: string;
  user_id?: string;
}

export async function updatePlanStatus(planId: string, completed: boolean) {
  const supabase = createClient();
  return await supabase
    .from('plans')
    .update({ completed })
    .eq('id', planId);
}

export async function createPlan(title: string, time: string, target_date: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('plans')
    .insert([
      { 
        title, 
        time, 
        target_date,
        completed: false 
      }
    ])
    .select()
    .single();
  return { data, error };
}

export async function deletePlanApi(planId: string) {
  const supabase = createClient();
  return await supabase.from('plans').delete().eq('id', planId);
}

export async function fetchPlansByDate(date: string) {
  const supabase = createClient();
  return await supabase
    .from('plans')
    .select('*')
    .eq('target_date', date) 
    .order('time', { ascending: true });
}