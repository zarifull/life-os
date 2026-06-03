'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react'; 
import { useRouter, useParams } from 'next/navigation';
import { AdventureHeader } from './_components/AdventureHeader';
import { QuickLog } from './_components/QuickLog';
import Timeline from './TimeLine';

export default function DiaryPage({ params }: { params?: { locale?: string } }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [refreshKey, setRefreshKey] = useState(0);
    const router = useRouter(); 
    const nextParams = useParams();
    
    const rawLocale = params?.locale || nextParams?.locale || 'en';
    const locale = rawLocale !== 'undefined' ? rawLocale : 'en';
    const refreshTimeline = () => setRefreshKey(prev => prev + 1);

  return (
    <main 
      className="min-h-screen relative pt-24 pb-20 px-4 md:px-6 overflow-hidden border-white/70 border-2 md:border-[5px] rounded-[20px] md:rounded-[80px]"
      style={{
        background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.button
          onClick={() => router.push(`/${locale}/dashboard#explore`)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ x: -5, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          className="
          fixed bottom-8 right-8 z-50
          flex items-center justify-center w-14 h-14 rounded-full 
          bg-white/60 backdrop-blur-xl border border-white/80 
          text-indigo-500 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]
          hover:bg-white/80 transition-all
    "
        >
          <ArrowLeft size={18} />
          
        </motion.button>

        <AdventureHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <div className="relative mt-8 md:mt-12 px-4 md:px-8 py-8 md:py-12">
          
          <div className="mb-12 md:mb-16">
            <QuickLog onSaveSuccess={refreshTimeline} />
          </div>

          <div className="relative space-y-12 md:space-y-16">
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="absolute left-4 md:left-6 top-4 w-[2px] bg-gradient-to-b from-indigo-400/50 via-purple-300/20 to-transparent rounded-full origin-top" 
            />
            
            <Timeline activeFilter={activeFilter} key={refreshKey} />
          </div>
        </div>
      </div>
    </main>
  );
}