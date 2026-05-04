"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { logEnergy } from "@/lib/actions/energy"
import { useTranslations, useLocale } from 'next-intl';

type EnergyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

interface EnergyState {
  today: EnergyLevel
  tomorrow: EnergyLevel
  savedToday: boolean
}

const YESTERDAY_ENERGY: EnergyLevel = 5  

function getFillStyle(e: EnergyLevel, isGhost: boolean): React.CSSProperties {

  if (isGhost || e <= 0) return { background: "transparent" }
  if (e <= 2) return { background: "linear-gradient(to top,rgba(251,113,133,0.85),rgba(251,113,133,0.6))" }
  if (e <= 4) return { background: "linear-gradient(to top,rgba(251,191,36,0.85),rgba(251,191,36,0.6))" }
  if (e <= 6) return { background: "linear-gradient(to top,rgba(52,211,153,0.85),rgba(52,211,153,0.6))" }
  return { background: "linear-gradient(to top,#6366f1,#a78bfa 50%,#22d3ee)" }
}

function formatDate(d: Date, locale: string) {
  return d.toLocaleDateString(locale === 'kg' ? 'ky-KG' : locale, { month: "short", day: "numeric" })
}

function Wave() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: "100%", left: "-10%", right: "-10%", height: 12,
        background: "inherit", opacity: 0.4,
        clipPath: "polygon(0 60%,10% 30%,20% 60%,30% 30%,40% 60%,50% 30%,60% 60%,70% 30%,80% 60%,90% 30%,100% 60%,100% 100%,0 100%)",
        animation: "energyWave 3s ease-in-out infinite",
      }}
    />
  )
}

function Battery({
  level,
  isToday = false,
  isGhost = false,
}: {
  level: EnergyLevel
  isToday?: boolean
  isGhost?: boolean
}) {
  const pct = Math.round((level / 7) * 100)

  return (
    <div className="flex flex-col items-center gap-[3px] " style={{ opacity: isGhost ? 0.45 : 1 }}>
      <div
        className="rounded-t-[3px]"
        style={{
          width: 18, height: 6,
          background: isToday 
            ? "linear-gradient(to bottom,rgba(99,102,241,0.4),rgba(34,211,238,0.3))" 
            : "transparent",
          border: isGhost ? "1.5px dashed rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.6)",
          borderBottom: "none",
          marginBottom: -1,
        }}
      />
      <div
        style={{
          width: 52, height: 88,
          borderRadius: 12,
          padding: 3,
          background: isGhost ? "transparent" : "linear-gradient(145deg,rgba(255,255,255,0.7),rgba(200,195,230,0.3))",
          border: isGhost ? "1.5px dashed rgba(255,255,255,0.35)" : "1.5px solid rgba(255,255,255,0.75)",
          boxShadow: isToday ? "0 4px 20px rgba(99,102,241,0.2)" : "none",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: "100%", height: "100%",
            borderRadius: 9,
            background: isGhost ? "transparent" : "rgba(240,238,255,0.5)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}
        >
          {!isGhost && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 overflow-hidden"
              style={{
                borderRadius: "0 0 8px 8px",
                ...getFillStyle(level, isGhost),
              }}
              initial={{ height: 0 }}
              animate={{ height: `${pct}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "30%", background: "linear-gradient(to bottom,rgba(255,255,255,0.3),transparent)" }} />
              {level > 0 && <Wave />}
            </motion.div>
          )}

          <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ zIndex: 3 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ borderBottom: i < 6 ? `1px solid rgba(255,255,255,${isGhost ? '0.1' : '0.35'})` : "none" }}
              />
            ))}
          </div>
        </div>
      </div>
      <span className="text-[10px] font-bold tracking-widest text-indigo-400/50 mt-2">
        {isGhost ? "FUTURE" : `${level}/7`}
      </span>
    </div>
  )
}

function TapDots({ value, onChange }: { value: EnergyLevel; onChange: (v: EnergyLevel) => void }) {
  return (
    <div className="flex flex-col gap-[4px] items-center">
      {Array.from({ length: 7 }, (_, i) => 7 - i).map((n) => {
        const filled = value >= n
        return (
          <motion.button
            key={n}
            onClick={() => onChange(value === n ? Math.max(0, n - 1) as EnergyLevel : n as EnergyLevel)}
            className="flex items-center justify-center rounded-full focus:outline-none"
            style={{
              width: 20, height: 20,
              fontSize: 8,
              background: filled
                ? "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(34,211,238,0.12))"
                : "rgba(255,255,255,0.3)",
              border: filled
                ? "1px solid rgba(99,102,241,0.32)"
                : "1px solid rgba(180,170,220,0.3)",
              color: filled ? "rgba(99,102,241,0.8)" : "rgba(110,100,170,0.35)",
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            {n}
          </motion.button>
        )
      })}
    </div>
  )
}

function BatteryRow({ children, isToday = false, onClick, isGhost = false }: { children: React.ReactNode; isToday?: boolean; onClick?: () => void; isGhost?: boolean }) {
  return (
    <motion.div
      onClick={onClick}
      className="relative flex flex-row items-center justify-between gap-2 sm:gap-5 overflow-hidden"
      style={{
        padding: "16px 20px",
        borderRadius: 32,
        background: isToday 
          ? "rgba(255,255,255,0.65)" 
          : isGhost 
            ? "rgba(255,255,255,0.25)" 
            : "rgba(255,255,255,0.4)",
        
        border: isToday 
          ? "3px solid rgba(255,255,255,1)" 
          : isGhost 
            ? "1.5px solid rgba(255,255,255,1)"
            : "1px solid rgba(255,255,255,0.6)", 
        
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        cursor: onClick ? "pointer" : "default",
        opacity: isGhost ? 0.8 : 1,
        boxShadow: isToday ? "0 20px 40px rgba(0,0,0,0.05)" : "none"
      }}
      whileHover={onClick ? { y: -2, background: "rgba(255,255,255,0.4)" } : {}}
    >
      {children}
    </motion.div>
  )
}

function GlassPillBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <motion.button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full focus:outline-none"
      style={{
        padding: "8px 18px",
        background: "rgba(255,255,255,0.5)",
        border: "1px solid rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        ...style,
      }}
      whileHover={{ y: -1, background: "rgba(255,255,255,0.7)" }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}

export default function EnergySection() {
  const router = useRouter()
  const locale = useLocale()
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<EnergyState>({ today: 0, tomorrow: 0, savedToday: false })
  const [justSaved, setJustSaved] = useState(false)
  const t = useTranslations('Energy')

  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  const tomorrowDate = new Date(today); tomorrowDate.setDate(today.getDate() + 1)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("lifeos-energy")
    if (stored) {
      try { setState(JSON.parse(stored)) } catch {}
    }
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem("lifeos-energy", JSON.stringify(state))
  }, [state, mounted]);

  const setTodayEnergy = (v: EnergyLevel) => setState(p => ({ ...p, today: v, savedToday: false }))
  const cycleTomorrow = () => setState(p => ({ ...p, tomorrow: (p.tomorrow >= 7 ? 0 : p.tomorrow + 1) as EnergyLevel }))

  const handleSave = async () => {
    try {
      const { error } = await logEnergy(state.today, state.tomorrow)
      if (!error) {
        setState(p => ({ ...p, savedToday: true }))
        setJustSaved(true)
        setTimeout(() => setJustSaved(false), 2000)
      }
    } catch (err) { console.error(err) }
  }

  if (!mounted) return null

  return (
    <>
      <style>{`
        @keyframes energyWave {
          0%,100% { transform: translateX(0) }
          50%      { transform: translateX(-8%) }
        }
      `}</style>

      <section className="relative w-full">
        <div
          className="relative rounded-[48px] overflow-hidden px-6 sm:px-10 py-12"
          style={{
            background: "linear-gradient(145deg,#ece9ff 0%,#f3eeff 22%,#ffe8f8 52%,#e8f0ff 78%,#e4f5ff 100%)",
            backdropFilter: "blur(80px) saturate(180%)",
            WebkitBackdropFilter: "blur(80px) saturate(180%)",
            border: "1.5px solid rgba(255,255,255,0.7)",
            boxShadow: "0 40px 120px rgba(120,100,200,0.12)"
          }}
        >
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <span className="text-[11px] font-black tracking-[0.4em] text-indigo-900/40 uppercase">
                {t('title')}
              </span>
            </div>
            <GlassPillBtn onClick={() => router.push(`/${locale}/history/energy`)}>
               <span className="text-[9px] font-bold tracking-widest text-indigo-500/60 uppercase">{t('archive')}</span>
            </GlassPillBtn>
          </div>

          <div className="flex flex-col gap-6">
            <BatteryRow>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-slate-400 uppercase">{t('yesterday')}</span>
                <span className="text-xs sm:text-base font-serif italic text-slate-500">{formatDate(yesterday, locale)}</span>
              </div>
              <Battery level={YESTERDAY_ENERGY} />
              <div className="flex flex-col items-center opacity-30">
                <span className="text-3xl font-serif text-slate-800">{YESTERDAY_ENERGY}</span>
                <span className="text-[8px] font-bold tracking-widest uppercase">{t('readOnly')}</span>
              </div>
            </BatteryRow>

            <BatteryRow isToday>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] sm:text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase">{t('today')}</span>
                <span className="text-xs sm:text-base font-serif italic text-xl text-slate-800">{formatDate(today, locale)}</span>
              </div>
              <Battery level={state.today} isToday />
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl font-serif text-indigo-600 font-bold">{state.today}</span>
                <TapDots value={state.today} onChange={setTodayEnergy} />
              </div>
            </BatteryRow>

            <BatteryRow onClick={cycleTomorrow} isGhost>
              <div className="flex flex-col gap-1">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-slate-400 uppercase">{t('tomorrow')}</span>
                <span className="text-xs sm:text-base font-serif italic text-slate-400">{formatDate(tomorrowDate, locale)}</span>
              </div>
              <Battery level={state.tomorrow} isGhost />
              <div className="flex flex-col items-center">
                <span className="text-3xl font-serif text-slate-400/60">{state.tomorrow || "—"}</span>
                <span className="text-[8px] font-bold tracking-widest text-slate-400 uppercase mt-1">{t('intention')}</span>
              </div>
            </BatteryRow>
          </div>

          <div className="mt-12 flex flex-col gap-4">
          <motion.button
            onClick={handleSave}
            disabled={state.today === 0}
            className="w-full py-5 rounded-full transition-all relative overflow-hidden group"
            style={{
              border: "3px solid rgba(255, 255, 255, 1)",
              background: "rgba(255, 255, 255, 0.45)",
              backdropFilter: "blur(30px) saturate(140%)",
              WebkitBackdropFilter: "blur(30px) saturate(140%)",
              boxShadow: "0 20px 40px rgba(120, 100, 200, 0.15)",
              cursor: state.today === 0 ? "not-allowed" : "pointer"
            }}
            whileHover={state.today !== 0 ? { 
              y: -3, 
              background: "rgba(255, 255, 255, 0.6)",
              boxShadow: "0 25px 50px rgba(120, 100, 200, 0.25)" 
            } : {}}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
            
            <span className="relative z-10 text-[10px] font-black tracking-[0.5em] text-indigo-600 uppercase">
              {justSaved ? t('success') : t('logButton')}
            </span>
          </motion.button>
          </div>
        </div>
      </section>
    </>
  )
}