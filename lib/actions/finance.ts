"use server"

import { prisma } from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';
import { TransactionType } from '@/types/finance';
import { revalidatePath } from 'next/cache';

export async function addTransaction(
  amount: number, 
  type: TransactionType, 
  category: string,
  label: string = ""
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  try {
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        category,
        label,
        userId: user.id
      }
    });

    revalidatePath('/[locale]/finance');
    return transaction;
  } catch (error) {
    console.error("Prisma Error:", error);
    throw new Error("Failed to save transaction.");
  }
}

export async function getBalance() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return 0;

  const result = await prisma.transaction.findMany({
    where: { userId: user.id },
    select: { amount: true, type: true }
  });

  return result.reduce((acc: number, curr: { amount: number; type: string }) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);
}



export async function deleteTransaction(id: string) {
    try {
        await prisma.transaction.delete({
            where: { id }
        });
        
        revalidatePath('/[locale]/finance', 'page');
        return { success: true };
    } catch (error) {
        console.error("Delete failed:", error);
        throw new Error("Could not remove the entry.");
    }
}
export async function updateTransaction(id: string, data: { label: string, amount: number }) {
  try {
      await prisma.transaction.update({
          where: { id },
          data: {
              label: data.label,
              amount: data.amount
          }
      });
      revalidatePath('/[locale]/finance', 'page');
      return { success: true };
  } catch (error) {
      throw new Error("Failed to update");
  }
}