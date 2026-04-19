import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

interface DailyBurnEntry {
  id: string;
  amount: number;
  category: string;
  createdAt: Date;
}

interface MonthlyAccumulator {
  [key: string]: number;
}

export async function GET() {
  try {
    const allExpenses = await prisma.dailyBurn.findMany() as DailyBurnEntry[];
    
    const monthlyStats = allExpenses.reduce((acc: MonthlyAccumulator, curr: DailyBurnEntry) => {
      const month = curr.createdAt.toLocaleString('default', { month: 'long' });
      
      if (!acc[month]) {
        acc[month] = 0;
      }
      
      acc[month] += curr.amount;
      return acc;
    }, {}); 

    return NextResponse.json(monthlyStats);
  } catch (error) {
    console.error("Finance API Error:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}