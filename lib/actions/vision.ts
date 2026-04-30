'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';


export async function addVision(formData: { title: string; image_url: string;}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await supabase
    .from('vision_board') 
    .insert([
      { 
        title: formData.title, 
        image_url: formData.image_url, 
        user_id: user.id 
      }
    ]);

  if (error) {
    console.error('Database Error:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/vision');
  return { success: true };
}


export async function toggleVisionStatus(id: string) {
  const supabase = await createClient();
  
  const { data: vision } = await supabase.from('vision_board').select('completed').eq('id', id).single();
  
  const { error } = await supabase
    .from('vision_board')
    .update({ completed: !vision?.completed })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/vision');
  return { success: true };
}

export async function deleteVision(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('vision_board').delete().eq('id', id);

  if (error) return { success: false, error: error.message };
  revalidatePath('/vision');
  return { success: true };
}