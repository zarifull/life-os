"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

type EnergyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

interface DayRecord {
  date: Date
  energy: EnergyLevel
  mood: number      // 1–5
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

function makeRng(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xFFFFFFFF }
}

function generateHistory(days: number): DayRecord[] {
  const rng = makeRng(42)
  const today = new Date()
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (days - 1 - i))
    const isToday = i === days - 1
    return {
      date: d,
      energy: isToday ? 0 : Math.round(rng() * 6) + 1 as EnergyLevel,
      mood: Math.round(rng() * 4) + 1,
      isToday,
    }
  })
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
          <span key={n} style={{ fontSize: 8, color: "rgba(110,100,170,0.32)", letterSpacing: "0.1em" }}>{n}</span>
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
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState(30)
  const [allHistory] = useState(() => generateHistory(80))  

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const history = allHistory.slice(-filter)
  const logged = history.filter(d => d.energy > 0)
  const avg = logged.length ? (logged.reduce((a, b) => a + b.energy, 0) / logged.length).toFixed(1) : "—"
  const best = logged.length ? Math.max(...logged.map(d => d.energy)) : 0

  let streak = 0
  for (let i = allHistory.length - 2; i >= 0; i--) {
    if (allHistory[i].energy > 0) streak++
    else break
  }

  const FILTERS = [7, 14, 30]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;1,200;1,300&display=swap');
      `}</style>

      <div
        className="min-h-screen"
        style={{ background: "linear-gradient(145deg,#ece9ff 0%,#f3eeff 22%,#ffe8f8 52%,#e8f0ff 78%,#e4f5ff 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-5 py-10 pb-20">

          <motion.button
            onClick={() => router.push(`/${locale}/dashboard`)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full mb-8 focus:outline-none"
            style={{
              padding: "8px 18px",
              background: "rgba(255,255,255,0.52)", border: "1px solid rgba(255,255,255,0.82)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 2px 16px rgba(120,100,200,0.08),inset 0 1px 0 rgba(255,255,255,0.95)",
              fontSize: 10, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase",
              color: "rgba(99,102,241,0.65)",
            }}
            whileHover={{ x: -2 }}
          >
            ‹ &nbsp;Back
          </motion.button>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "clamp(40px,6vw,64px)", fontWeight: 200,
                lineHeight: 0.92, letterSpacing: "-3px",
                background: "linear-gradient(160deg,#3730a3,#6366f1 45%,#22d3ee)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                marginBottom: 8,
              }}
            >
              Energy<br />Archive
            </h1>
            <p style={{ fontSize: 10, fontWeight: 400, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(110,100,170,0.42)", marginBottom: 32 }}>
              Your energy history · {new Date().getFullYear()}
            </p>
          </motion.div>

          <GlassCard delay={0.1}>
            <SecLabel>Overview</SecLabel>
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[
                { val: avg, lbl: "Avg / 7" },
                { val: streak, lbl: "Day streak" },
                { val: best ? `${best}/7` : "—", lbl: "Best level" },
              ].map(({ val, lbl }) => (
                <div key={lbl} className="rounded-[20px] text-center py-4 px-3"
                  style={{ background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.78)", boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.95)" }}>
                  <span
                    className="block mb-1"
                    style={{
                      fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 200, lineHeight: 1, letterSpacing: "-1px",
                      background: "linear-gradient(160deg,#6366f1,#22d3ee)",
                      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    }}
                  >{val}</span>
                  <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(110,100,170,0.4)" }}>{lbl}</span>
                </div>
              ))}
            </div>

            <SecLabel>Last {filter} days</SecLabel>
            <EnergyChart data={history} />
          </GlassCard>

          <GlassCard delay={0.2}>
            <div className="flex gap-2 mb-6">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="rounded-full focus:outline-none transition-all duration-200"
                  style={{
                    padding: "6px 16px",
                    fontSize: 9, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase",
                    background: filter === f ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.32)",
                    border: filter === f ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.6)",
                    color: filter === f ? "rgba(99,102,241,0.75)" : "rgba(110,100,170,0.5)",
                    boxShadow: filter === f ? "0 2px 12px rgba(99,102,241,0.1)" : "none",
                  }}
                >
                  {f} days
                </button>
              ))}
            </div>

            <SecLabel>Daily log</SecLabel>

            <div className="flex flex-col gap-[10px]">
              {[...history].reverse().map((h, i) => (
                <motion.div
                  key={h.date.toISOString()}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.015, duration: 0.3 }}
                  className="grid items-center gap-4"
                  style={{
                    gridTemplateColumns: "auto 1fr auto auto",
                    padding: "14px 18px",
                    borderRadius: 18,
                    background: h.isToday ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.38)",
                    border: h.isToday ? "1px solid rgba(255,255,255,0.85)" : "1px solid rgba(255,255,255,0.68)",
                    backdropFilter: "blur(20px)",
                    boxShadow: h.isToday
                      ? "0 4px 20px rgba(99,102,241,0.08),inset 0 1.5px 0 rgba(255,255,255,1)"
                      : "inset 0 1px 0 rgba(255,255,255,0.9)",
                    cursor: "default",
                  }}
                >
                  <div className="flex flex-col gap-[1px]" style={{ minWidth: 52 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 300, lineHeight: 1, color: "rgba(90,80,160,0.55)", letterSpacing: "-1px" }}>
                      {String(h.date.getDate()).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(110,100,170,0.38)" }}>
                      {MONTHS[h.date.getMonth()]}
                    </span>
                    <span style={{ fontSize: 7, color: "rgba(110,100,170,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      {WEEKDAYS[h.date.getDay()]}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative overflow-hidden" style={{ height: 6, borderRadius: 6, background: "rgba(200,195,230,0.25)" }}>
                      <motion.div
                        className="absolute top-0 left-0 h-full rounded-full"
                        style={getFillStyle(h.energy)}
                        initial={{ width: 0 }}
                        animate={{ width: h.isToday ? "0%" : `${Math.round(h.energy / 7 * 100)}%` }}
                        transition={{ duration: 0.8, delay: i * 0.015, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>

                  <span style={{
                    fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 300, letterSpacing: "-0.5px",
                    minWidth: 36, textAlign: "right",
                    background: h.energy > 0 ? "linear-gradient(160deg,#6366f1,#22d3ee)" : "none",
                    WebkitBackgroundClip: h.energy > 0 ? "text" : undefined,
                    WebkitTextFillColor: h.energy > 0 ? "transparent" : "rgba(110,100,170,0.3)",
                    backgroundClip: h.energy > 0 ? "text" : undefined,
                  }}>
                    {h.isToday ? "—" : `${h.energy}/7`}
                  </span>

                  {h.isToday ? (
                    <span style={{ fontSize: 7, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 100, background: "rgba(99,102,241,0.1)", border: "0.5px solid rgba(99,102,241,0.25)", color: "rgba(99,102,241,0.65)" }}>
                      Today
                    </span>
                  ) : (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: MOOD_COLORS[h.mood], flexShrink: 0 }} />
                  )}
                </motion.div>
              ))}
            </div>
          </GlassCard>

        </div>
      </div>
    </>
  )
}
