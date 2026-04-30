'use client';

import { motion } from 'framer-motion';
import { Wallet, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation'; // Added to ensure correct locale routing

export function NavigationGrid() {
  const t = useTranslations('Navigation');
  const params = useParams();
  const locale = params.locale;

  const navItems = [
    { 
      label: t('notebook'), 
      sub: t('notebookSub'), 
      href: 'history', 
      icon: <BookOpen size={32} strokeWidth={1.5} />, 
      color: 'text-indigo-500',
      glow: 'group-hover:bg-indigo-500/30'
    },
    { 
      label: t('finance'), 
      sub: t('financeSub'), 
      href: 'finance', 
      icon: <Wallet size={32} strokeWidth={1.5} />, 
      color: 'text-emerald-500',
      glow: 'group-hover:bg-emerald-500/30'
    },
    { 
      label: t('vision'), 
      sub: t('visionSub'), 
      href: 'vision', // Make sure you have app/[locale]/vision/page.tsx
      icon: <Sparkles size={32} strokeWidth={1.5} />, 
      color: 'text-amber-500',
      glow: 'group-hover:bg-amber-500/30'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto px-4 mt-12">
      {navItems.map((item) => (
        /* Use the locale in the path to keep the user in their language */
        <Link href={`/${locale}/${item.href}`} key={item.href}>
          <motion.div
            whileHover={{ y: -12, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative group p-12 rounded-[45px] flex flex-col items-center justify-center overflow-hidden transition-all duration-500"
          >
            {/* Liquid Glass Background */}
            <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl border border-white/40 rounded-[45px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)]" />
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Icon with Motion */}
            <div className={`relative z-10 mb-6 ${item.color} group-hover:scale-125 group-hover:rotate-6 transition-all duration-500`}>
              {item.icon}
            </div>

            <div className="relative z-10 text-center">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">
                {item.label}
              </h3>
              <p className="text-[10px] font-black text-slate-500/60 uppercase tracking-[0.35em] mt-3 group-hover:text-slate-600 transition-colors">
                {item.sub}
              </p>
            </div>
            
            <div className={`absolute -bottom-12 -right-12 w-40 h-40 blur-[60px] transition-all duration-700 opacity-0 group-hover:opacity-100 ${item.glow}`} />
          </motion.div>
        </Link>
      ))}
    </div>
  );
}