"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { useTranslations } from "next-intl" 

type EnergyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

interface DayRecord {
  date: Date
  energy: EnergyLevel
  mood: number      
  isToday: boolean
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const WEEKDAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
const MOOD_COLORS = ["","rgba(251,113,133,0.7)","rgba(251,191,36,0.7)","rgba(34,211,238,0.7)","rgba(52,211,153,0.7)","rgba(167,139,250,0.9)"]

function getFillStyle(e: EnergyLevel): React.CSSProperties {
  if (e <= 0) return { background: "rgba(200,195,230,0.2)" }
  if (e <= 2) return { background: "linear-gradient(90deg,rgba(251,113,133,0.75),rgba(251,113,133,0.5))" }
  if (e <= 4) return { background: "linear-gradient(90deg,rgba(251,191,36,0.8),rgba(251,191,36,0.55))" }
  if (e <= 6) return { background: "linear-gradient(90deg,rgba(52,211,153,0.8),rgba(52,211,153,0.55))" }
  return { background: "linear-gradient(90deg,#6366f1,#a78bfa 50%,#22d3ee)" }
}

function EnergyChart({ data }: { data: DayRecord[] }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [animated, setAnimated] = useState(false)

  const logged = data.filter(d => d.energy > 0)

  useEffect(() => {
    setTimeout(() => setAnimated(true), 200)
  }, [data])

  if (logged.length < 2) return null

  const W = 600, H = 140, PL = 24, PB = 20, PT = 10
  const xStep = (W - PL) / (logged.length - 1)
  const yScale = (H - PB - PT) / 7
  const pts = logged.map((d, i) => ({ x: PL + i * xStep, y: H - PB - d.energy * yScale }))
  const pathD = "M" + pts.map(p => `${p.x},${p.y}`).join(" L")
  const areaD = pathD + ` L${pts[pts.length-1].x},${H - PB} L${PL},${H - PB} Z`

  return (
    <div
      className="relative rounded-[20px] overflow-hidden"
      style={{ padding: "20px 16px 12px", background: "rgba(255,255,255,0.32)", border: "1px solid rgba(255,255,255,0.65)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)" }}
    >
      <div className="absolute flex flex-col justify-between" style={{ left: 4, top: 20, bottom: 28 }}>
        {[7,5,3,1].map(n => (
          <span key={n} style={{ fontSize: 8, color: "#4338ca", letterSpacing: "0.1em" }}>{n}</span>
        ))}
      </div>
      <svg ref={svgRef} style={{ width: "100%", height: 160, display: "block" }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99,102,241,0.32)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0.02)" />
          </linearGradient>
          <linearGradient id="lineG" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        {[1,3,5,7].map(y => (
          <line key={y} x1={PL} x2={W} y1={H-PB-y*yScale} y2={H-PB-y*yScale} stroke="rgba(180,170,220,0.18)" strokeWidth="0.5" />
        ))}
        <path d={areaD} fill="url(#areaG)" />
        <path d={pathD} fill="none" stroke="url(#lineG)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="white" stroke="rgba(99,102,241,0.6)" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  )
}

function GlassCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-[44px] p-[3px] mb-5"
      style={{
        background: "linear-gradient(145deg,rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.42) 22%,rgba(220,210,255,0.2) 50%,rgba(200,185,255,0.48) 78%,rgba(135,215,255,0.52) 100%)",
        boxShadow: "0 40px 120px rgba(120,100,200,0.14),0 8px 32px rgba(0,0,0,0.06),inset 0 2px 0 rgba(255,255,255,1)",
      }}
    >
      <div
        className="relative rounded-[42px] overflow-hidden px-8 py-8"
        style={{
          background: "linear-gradient(145deg,#ece9ff 0%,#f3eeff 22%,#ffe8f8 52%,#e8f0ff 78%,#e4f5ff 100%)",
          backdropFilter: "blur(80px) saturate(180%)",
          WebkitBackdropFilter: "blur(80px) saturate(180%)",
          border: "0.5px solid rgba(255,255,255,0.6)",
        }}
      >
        <div className="absolute top-0 left-[8%] right-[8%] h-px pointer-events-none"
          style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.98) 40%,rgba(255,255,255,0.9) 60%,transparent)" }} />
        {children}
      </div>
    </motion.div>
  )
}

function SecLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(110,100,170,0.45)" }}>
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right,rgba(180,170,220,0.25),transparent)" }} />
    </div>
  )
}

export default function EnergyArchivePage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('Energy')
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState(30)
  const [history, setHistory] = useState<DayRecord[]>([]) 
  const [loading, setLoading] = useState(true)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fetchHistory = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('energy_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (data) {
        const formatted: DayRecord[] = data.map(row => ({
          date: new Date(row.date + 'T00:00:00'),
          energy: row.level as EnergyLevel,
          mood: row.intention || 3,
          isToday: row.date === new Date().toISOString().split('T')[0]
        }))
        setHistory(formatted)
      }
      setLoading(false)
    }
    fetchHistory()
  }, [])

  if (!mounted) return null

  const filteredHistory = history.slice(-filter)
  const logged = filteredHistory.filter(d => d.energy > 0)
  
  const avg = logged.length 
    ? (logged.reduce((a, b) => a + b.energy, 0) / logged.length).toFixed(1) 
    : "—"
  
  const best = logged.length ? Math.max(...logged.map(d => d.energy)) : 0

  let streak = 0
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].energy > 0) streak++
    else break
  }

  const FILTERS = [7, 14, 30]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;1,200;1,300&display=swap');
        
        .stat-card span:last-child {
          color: #4338ca !important; /* Deep Indigo for readability */
          opacity: 0.8;
        }
        
        .log-date-main {
          color: #1e1b4b !important; /* Near Black-Indigo for maximum contrast */
          font-weight: 500 !important;
        }
        
        .log-date-sub {
          color: #4338ca !important; /* Indigo for labels */
          font-weight: 700 !important;
        }
        @media (max-width: 640px) {
          .glass-header { font-size: 42px !important; letter-spacing: -1.5px !important; color: #1e1b4b !important; }
          .stat-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 8px !important; }
          .stat-card { padding: 12px 8px !important; border: 1.5px solid rgba(255,255,255,0.9) !important; }
          .stat-card span:first-child { font-size: 26px !important; font-weight: 400 !important; }
          
          .log-row { 
            grid-template-columns: 45px 1fr 45px !important; 
            padding: 14px 16px !important; 
            background: rgba(255,255,255,0.6) !important; /* Brighter background for better text pop */
          }
        }
      
        
      `}</style>

      <div className="min-h-screen" style={{ background: "linear-gradient(145deg,#ece9ff 0%,#f3eeff 22%,#ffe8f8 52%,#e8f0ff 78%,#e4f5ff 100%)" }}>
        <div className="max-w-3xl mx-auto px-5 py-10 pb-20">

          <motion.button
            onClick={() => router.push(`/${locale}/dashboard`)}
            className="inline-flex items-center gap-2 rounded-full mb-8 focus:outline-none"
            style={{ padding: "8px 18px", background: "rgba(255,255,255,0.52)", border: "1px solid rgba(255,255,255,0.82)", backdropFilter: "blur(20px)", fontSize: 10, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(99,102,241,0.65)" }}
          >
            ‹ &nbsp;{t('back')}
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="glass-header" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,6vw,64px)", fontWeight: 200, lineHeight: 0.92, letterSpacing: "-3px", background: "linear-gradient(160deg,#3730a3,#6366f1 45%,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>
              {t('archiveTitle')}
            </h1>
          </motion.div>

          {loading ? (
            <div className="py-20 text-center opacity-30 tracking-[0.5em] text-[10px] uppercase">{t('loading')}</div>
          ) : (
            <>
              <GlassCard delay={0.1}>
                <SecLabel>{t('overview')}</SecLabel>
                <div className="stat-grid grid grid-cols-3 gap-3 mb-7">
                  {[
                    { val: avg, lbl: t('avgLabel') },
                    { val: streak, lbl: t('streakLabel') },
                    { val: best ? `${best}/7` : "—", lbl: t('bestLabel') },
                  ].map(({ val, lbl }) => (
                    <div key={lbl} className="stat-card rounded-[20px] text-center py-4 px-3" style={{ background: "rgba(255,255,255,0.45)", border: "3px solid rgba(255,255,255,0.78)" }}>
                      <span className="block mb-1" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 800, background: "linear-gradient(160deg,#6366f1,#22d3ee)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{val}</span>
                      <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(110,100,170,0.4)" }}>{lbl}</span>
                    </div>
                  ))}
                </div>

                <SecLabel>{t('visualHistory', { days: filter })}</SecLabel>
                <EnergyChart data={filteredHistory} />
              </GlassCard>

              <GlassCard delay={0.2}>
                <div className="flex flex-wrap gap-2 mb-6">
                  {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)} className="rounded-full px-4 py-1.5 text-[9px] tracking-widest uppercase transition-all" style={{ background: filter === f ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.32)", border: filter === f ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.6)", color: filter === f ? "rgba(99,102,241,0.75)" : "rgba(110,100,170,0.5)" }}>
                      {f} {t('days')}
                    </button>
                  ))}
                </div>

                <SecLabel>{t('dailyLog')}</SecLabel>
                <div className="flex flex-col gap-[10px]">
                  {[...filteredHistory].reverse().map((h, i) => (
                    <motion.div key={h.date.toISOString()} className="log-row grid items-center gap-4" style={{ gridTemplateColumns: "auto 1fr auto auto", padding: "14px 18px", borderRadius: 18, background: "rgba(255,255,255,0.38)", border: "3px solid rgba(255,255,255,0.68)" }}>
                      <div className="flex flex-col" style={{ minWidth: 40 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 25, fontWeight:"500", color: "rgba(90,80,160,0.6)" }}>{String(h.date.getDate()).padStart(2, "0")}</span>
                        <span style={{ fontSize: 7, textTransform: "uppercase", opacity: 0.4 }}>{MONTHS[h.date.getMonth()]}</span>
                      </div>
                      <div className="energy-bar-container flex-1 h-1 rounded-full bg-indigo-100/30 overflow-hidden">
                         <div className="h-full rounded-full" style={{ width: `${(h.energy/7)*100}%`, ...getFillStyle(h.energy) }} />
                      </div>
                      <span style={{ 
                      fontFamily: "'Cormorant Garamond',serif", 
                      fontSize: 20, 
                      minWidth: 40, 
                      textAlign: "right", 
                      color: "#4338ca", 
                      fontWeight: 800 
                    }}>{h.isToday ? "—" : `${h.energy}/7`}</span>
                      {!h.isToday && <div className="mood-indicator" style={{ width: 8, height: 8, borderRadius: "50%", background: MOOD_COLORS[h.mood] }} />}
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </>
  )
}
