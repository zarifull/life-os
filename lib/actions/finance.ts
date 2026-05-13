"use server"

import { prisma } from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';
import { TransactionType } from '@/types/finance';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser as getAuthUser } from "@/lib/auth";



async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function addTransaction(
  amount: number, 
  type: TransactionType, 
  category: string,
  label: string = ""
) {
  const user = await getAuthenticatedUser();

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

    revalidatePath('/[locale]/finance', 'page');
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
        
        revalidatePath('/[locale]/finance', 'layout');
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
      revalidatePath('/[locale]/finance', 'layout');
      return { success: true };
  } catch (error) {
      throw new Error("Failed to update");
  }
}

export async function getMonthlyArchive(year: number) {
  const user = await getAuthenticatedUser();

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id, 
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
  });

  const monthlyStats = transactions.reduce((acc: any, t) => {
    const month = t.date.toLocaleString('en-US', { month: 'long' });
    if (!acc[month]) {
      acc[month] = { month, income: 0, spent: 0, tax: 0, surplus: 0 };
    }

    if (t.type === 'income') {
      acc[month].income += t.amount;
    } else {
      acc[month].spent += t.amount;
      if (t.label === 'System Tax' || t.category === 'Obligations') {
        acc[month].tax += t.amount;
      }
    }

    acc[month].surplus = acc[month].income - acc[month].spent;
    return acc;
  }, {});

  return Object.values(monthlyStats);
}


export async function updateVaultBalance(amount: number) {
  const vault = await prisma.vault.findFirst();
  
  if (vault) {
    await prisma.vault.update({
      where: { id: vault.id },
      data: { balance: { increment: amount } },
    });
  } else {
    await prisma.vault.create({ data: { balance: amount } });
  }
  
  revalidatePath('/[locale]/finance/archive', 'page');
}

export async function getYearlySummary(year: number) {
  const user = await getAuthenticatedUser();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`),
        },
      },
      select: {
        amount: true,
        type: true,
        category: true,
        label: true,
      }
    });

    const summary = transactions.reduce(
      (acc, t) => {
        if (t.type === 'income') {
          acc.income += t.amount;
        } else {
          acc.expenses += t.amount;
          if (t.label === 'System Tax' || t.category === 'Obligations') {
            acc.tax += t.amount;
          }
        }
        return acc;
      },
      { income: 0, expenses: 0, tax: 0 }
    );

    return summary;
  } catch (error) {
    console.error("Yearly Summary Error:", error);
    return { income: 0, expenses: 0, tax: 0 };
  }
}

export async function updateVaultSettings(autoVault: boolean) {
  const user = await getAuthenticatedUser();

  await prisma.finance.upsert({
    where: { userId: user.id },
    update: { autoVault },
    create: { userId: user.id, autoVault }
  });

  revalidatePath('/finance/archive');
}

export async function executeVaultAdjustment(amount: number) {
  const user = await getAuthenticatedUser();

  await prisma.userSettings.upsert({
      where: { userId: user.id },
      update: {
          vaultBalance: { increment: amount }
      },
      create: {
          userId: user.id,
          vaultBalance: amount,
          autoVault: true 
      }
  });

  revalidatePath('/[locale]/finance/archive', 'page');
  return { success: true };
}

