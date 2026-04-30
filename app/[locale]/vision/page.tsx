import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import VisionBoard from './_components/VisionBoard';
import { AddVisionModal } from './_components/AddVisionModal';

export default async function VisionPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations('Vision');

  if (!user) redirect('/login');

  const { data: visions, error } = await supabase
    .from('vision_board')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Error loading visions.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center pt-2 md:pt-8 pb-10">
      <div className="max-w-6xl mx-auto space-y-12">
        
      <header className="text-center space-y-1.5 mb-6 md:mb-12 mt-4 md:mt-0">
          <h2 className="text-2xl md:text-4xl font-serif text-slate-800 leading-tight">
            {t('header.quote')}{' '}
            <span className="text-indigo-600 italic">{t('header.accent')}</span>
          </h2>
          <div className="h-[1px] w-12 bg-slate-200 mx-auto" />
        </header>

        <Suspense fallback={<div className="h-40 animate-pulse bg-slate-50 rounded-3xl" />}>
          <VisionBoard visions={visions || []} />
        </Suspense>
        
        <AddVisionModal />
      </div>
    </main>
  );
}