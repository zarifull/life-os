import { prisma } from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';
import FinanceClient from './FinanceClient';
import { redirect } from 'next/navigation';

export default async function Page() {
  // 1. Secure the route - Ensure the user is logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Fetch today's transactions from Prisma
  // We use the 'userId' to ensure users only see their own money
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: 'desc',
    },
  });

  // 3. Calculate the current balance on the server for speed
  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  // 4. Send everything to your beautiful UI component
  return (
    <FinanceClient 
      initialTransactions={transactions} 
      initialBalance={totalBalance} 
    />
  );
}