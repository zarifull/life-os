import { createClient } from '../supabase/client'


export async function logEnergy(level: number, intention: number) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: new Error("Unauthorized") }
  
    const dateString = new Date().toISOString().split('T')[0] 
  
    return await supabase
      .from('energy_logs')
      .upsert({ 
        user_id: user.id, 
        date: dateString, 
        level: level,    
        intention: intention 
      }, { onConflict: 'user_id, date' })
  }