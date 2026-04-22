import { prisma } from '@/lib/db/prisma';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ArchiveClientPage from './_components/ArchiveClientPage';

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  });

  const monthlyStats = transactions.reduce((acc: any, transaction) => {
    const date = new Date(transaction.date);
    const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, income: 0, spent: 0, surplus: 0 };
    }

    if (transaction.type === 'income') {
      acc[monthYear].income += transaction.amount;
    } else {
      acc[monthYear].spent += transaction.amount;
    }

    acc[monthYear].surplus = acc[monthYear].income - acc[monthYear].spent;
    return acc;
  }, {});

  const realMonthlyData = Object.values(monthlyStats);

  return (
    <ArchiveClientPage 
     
      realMonthlyData={realMonthlyData as any} 
    />
  );
}