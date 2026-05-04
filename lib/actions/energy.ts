import { createClient } from '../supabase/client'


export async function logEnergy(level: number, intention: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: new Error("Unauthorized") }

  const dateString = new Date().toLocaleDateString('en-CA'); 

const safeLevel = Math.min(Math.max(level, 1), 10);
const safeIntention = Math.min(Math.max(intention, 1), 10);

const { data, error } = await supabase
  .from('energy_logs')
  .upsert({ 
    user_id: user.id, 
    date: dateString, 
    level: safeLevel,    
    intention: safeIntention 
  }, { onConflict: 'user_id,date' })

  if (error) {
    console.error("Supabase Error Details:", error.message, error.details, error.hint);
    return { error };
  }

  return { data };
}