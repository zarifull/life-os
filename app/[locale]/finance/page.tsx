import { prisma } from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';
import FinanceClient from './FinanceClient';
import { redirect } from 'next/navigation';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      date: 'desc',
    },
  });

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  return (
    <FinanceClient 
      initialTransactions={transactions} 
      initialBalance={totalBalance} 
    />
  );
}