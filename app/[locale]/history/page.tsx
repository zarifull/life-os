'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdventureHeader } from './_components/AdventureHeader';
import { QuickLog } from './_components/QuickLog';
import Timeline from './TimeLine';

export default function HistoryPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [refreshKey, setRefreshKey] = useState(0);
    
    const refreshTimeline = () => setRefreshKey(prev => prev + 1);

  return (
    <main 
      className="min-h-screen relative pt-24 pb-20 px-4 md:px-6 overflow-hidden border-white/70 border-2 md:border-[7px] rounded-[20px] md:rounded-[80px]"
      style={{
        background: "linear-gradient(145deg, #ece9ff 0%, #f3eeff 22%, #ffe8f8 52%, #e8f0ff 78%, #e4f5ff 100%)",
      }}
    >
      <div className="relative z-10 max-w-3xl mx-auto">
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