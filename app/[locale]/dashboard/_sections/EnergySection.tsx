"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useLocale } from "next-intl"

type EnergyLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

interface EnergyState {
  today: EnergyLevel
  tomorrow: EnergyLevel
  savedToday: boolean
}

const YESTERDAY_ENERGY: EnergyLevel = 5  

function getFillStyle(e: EnergyLevel): React.CSSProperties {
  if (e <= 0) return { background: "transparent" }
  if (e <= 2) return { background: "linear-gradient(to top,rgba(251,113,133,0.85),rgba(251,113,133,0.6))" }
  if (e <= 4) return { background: "linear-gradient(to top,rgba(251,191,36,0.85),rgba(251,191,36,0.6))" }
  if (e <= 6) return { background: "linear-gradient(to top,rgba(52,211,153,0.85),rgba(52,211,153,0.6))" }
  return { background: "linear-gradient(to top,#6366f1,#a78bfa 50%,#22d3ee)" }
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
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
  opacity = 1,
}: {
  level: EnergyLevel
  isToday?: boolean
  opacity?: number
}) {
  const pct = Math.round((level / 7) * 100)

  return (
    <div className="flex flex-col items-center gap-[3px]" style={{ opacity }}>
      <div
        className="rounded-t-[3px]"
        style={{
          width: 18, height: 6,
          background: isToday
            ? "linear-gradient(to bottom,rgba(99,102,241,0.4),rgba(34,211,238,0.3))"
            : "linear-gradient(to bottom,rgba(255,255,255,0.7),rgba(200,195,230,0.5))",
          border: "1px solid rgba(255,255,255,0.6)",
          borderBottom: "none",
          marginBottom: -1,
        }}
      />
      <div
        style={{
          width: 52, height: 88,
          borderRadius: 10,
          padding: 3,
          background: "linear-gradient(145deg,rgba(255,255,255,0.7),rgba(200,195,230,0.3))",
          border: "1.5px solid rgba(255,255,255,0.75)",
          boxShadow: isToday
            ? "0 4px 20px rgba(99,102,241,0.2),inset 0 1px 0 rgba(255,255,255,0.9)"
            : "0 4px 16px rgba(120,100,200,0.12),inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: "100%", height: "100%",
            borderRadius: 8,
            background: "rgba(240,238,255,0.5)",
            border: "0.5px solid rgba(255,255,255,0.4)",
            display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}
        >
          <motion.div
            className="absolute bottom-0 left-0 right-0 overflow-hidden"
            style={{
              borderRadius: "0 0 7px 7px",
              ...getFillStyle(level),
            }}
            initial={{ height: 0 }}
            animate={{ height: `${pct}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{ height: "30%", background: "linear-gradient(to bottom,rgba(255,255,255,0.3),transparent)" }}
            />
            {level > 0 && <Wave />}
          </motion.div>

          <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ zIndex: 3 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ borderBottom: i < 6 ? "1.5px solid rgba(255,255,255,0.35)" : "none" }}
              />
            ))}
          </div>
        </div>
      </div>
      <span
        className="text-[10px] font-medium"
        style={{ letterSpacing: "0.15em", color: "rgba(99,102,241,0.5)", marginTop: 3 }}
      >
        {level > 0 ? `${level}/7` : "—"}
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
              width: 26, height: 26,
              fontSize: 9, fontWeight: 600,
              background: filled
                ? "linear-gradient(135deg,rgba(99,102,241,0.18),rgba(34,211,238,0.12))"
                : "rgba(255,255,255,0.3)",
              border: filled
                ? "1px solid rgba(99,102,241,0.32)"
                : "1px solid rgba(180,170,220,0.3)",
              color: filled ? "rgba(99,102,241,0.8)" : "rgba(110,100,170,0.35)",
              boxShadow: filled ? "0 0 8px rgba(99,102,241,0.15)" : "none",
            }}
            whileHover={{ scale: 1.18 }}
            whileTap={{ scale: 0.9 }}
          >
            {n}
          </motion.button>
        )
      })}
    </div>
  )
}

function BatteryRow({ children, isToday = false, onClick }: {
  children: React.ReactNode
  isToday?: boolean
  onClick?: () => void
}) {
  return (
    <motion.div
      onClick={onClick}
      className="relative grid items-center gap-5 overflow-hidden"
      style={{
        gridTemplateColumns: "80px 1fr auto",
        padding: "18px 20px",
        borderRadius: 24,
        background: isToday ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.42)",
        border: isToday ? "1px solid rgba(255,255,255,0.82)" : "1px solid rgba(255,255,255,0.72)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        boxShadow: isToday
          ? "0 12px 48px rgba(99,102,241,0.1),inset 0 2px 0 rgba(255,255,255,1)"
          : "0 6px 28px rgba(120,100,200,0.06),inset 0 1.5px 0 rgba(255,255,255,0.95)",
        cursor: onClick ? "pointer" : "default",
      }}
      whileHover={onClick ? { y: -2, background: "rgba(255,255,255,0.58)" } : {}}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute top-0 pointer-events-none"
        style={{
          left: "10%", right: "10%", height: 1,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)",
        }}
      />
      {children}
    </motion.div>
  )
}
function GlassPillBtn({ children, onClick, style }: {
  children: React.ReactNode
  onClick?: () => void
  style?: React.CSSProperties
}) {
  return (
    <motion.button
      onClick={onClick}
      className="inline-flex items-center gap-[6px] rounded-full focus:outline-none"
      style={{
        padding: "7px 16px",
        background: "rgba(255,255,255,0.52)",
        border: "1px solid rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 2px 16px rgba(120,100,200,0.08),inset 0 1px 0 rgba(255,255,255,0.95)",
        ...style,
      }}
      whileHover={{ y: -1, background: "rgba(255,255,255,0.72)", boxShadow: "0 8px 24px rgba(99,102,241,0.12)" }}
      whileTap={{ scale: 0.97 }}
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

  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("lifeos-energy")
    if (stored) {
      try { setState(JSON.parse(stored)) } catch {}
    }
  }, [])

  useEffect(() => {
    if (!mounted) return;
  
    localStorage.setItem("lifeos-energy", JSON.stringify(state));
  }, [state, mounted]);
  const setTodayEnergy = (v: EnergyLevel) => setState(p => ({ ...p, today: v, savedToday: false }))
  const cycleTomorrow = () => setState(p => ({ ...p, tomorrow: (p.tomorrow >= 7 ? 0 : p.tomorrow + 1) as EnergyLevel }))

  const handleSave = () => {
    setState(p => ({ ...p, savedToday: true }))
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 2000)
  }

  if (!mounted) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,200;0,300;1,200;1,300&display=swap');
        @keyframes energyWave {
          0%,100% { transform: translateX(0) }
          50%      { transform: translateX(-8%) }
        }
        @keyframes es-sweep {
          0%,100% { left:-55% }
          42%     { left:130% }
        }
      `}</style>

      <section className="relative w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[44px] p-[3px]"
          style={{
            background: "linear-gradient(145deg,rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.42) 22%,rgba(220,210,255,0.2) 50%,rgba(200,185,255,0.48) 78%,rgba(135,215,255,0.52) 100%)",
            boxShadow: "0 40px 120px rgba(120,100,200,0.15),0 8px 32px rgba(0,0,0,0.06),inset 0 2px 0 rgba(255,255,255,1)",
          }}
        >
          <div
            className="relative rounded-[42px] overflow-hidden px-6 sm:px-10 py-10"
            style={{
              background: "linear-gradient(145deg,#ece9ff 0%,#f3eeff 22%,#ffe8f8 52%,#e8f0ff 78%,#e4f5ff 100%)",
              backdropFilter: "blur(25px) saturate(180%)",
              WebkitBackdropFilter: "blur(80px) saturate(180%)",
              border: "0.5px solid rgba(255,255,255,0.6)",
            }}
          >
            <div className="absolute top-0 left-[8%] right-[8%] h-px pointer-events-none"
              style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.98) 40%,rgba(255,255,255,0.9) 60%,transparent)" }} />

            <motion.div
              className="absolute top-0 bottom-0 w-[28%] pointer-events-none"
              style={{ background: "linear-gradient(105deg,transparent 22%,rgba(255,255,255,0.15) 50%,transparent 78%)", transform: "skewX(-10deg)" }}
              // animate={{ left: ["-55%", "130%", "-55%"] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", times: [0, 0.42, 1] }}
            />

            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#22d3ee)", boxShadow: "0 0 8px rgba(99,102,241,0.6)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(70,60,150,0.6)" }}>
                  Energy
                </span>
              </div>

              <GlassPillBtn onClick={() => router.push(`/${locale}/energy-archive`)}>
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="5" width="12" height="8" rx="1.5" stroke="rgba(99,102,241,0.6)" strokeWidth="1.2"/>
                  <path d="M1 7h12" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
                  <path d="M4.5 1.5L7 4.5 9.5 1.5" stroke="rgba(99,102,241,0.5)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="7" y1="1.5" x2="7" y2="4.5" stroke="rgba(99,102,241,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(99,102,241,0.65)" }}>
                  Energy Archive
                </span>
                <span style={{ fontSize: 11, color: "rgba(99,102,241,0.45)" }}>›</span>
              </GlassPillBtn>
            </div>

            <div className="relative z-10 flex flex-col gap-5">

              <BatteryRow>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(110,100,170,0.45)" }}>Yesterday</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 17, fontWeight: 600, fontStyle: "italic", color: "rgba(90,80,160,0.4)" }}>
                    {formatDate(yesterday)}
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.5em", textTransform: "uppercase", marginTop: 8, display: "inline-block", padding: "5px 10px", borderRadius: 80, background: "rgba(255,255,255,0.45)", border: "5px solid rgba(255,255,255,0.7)", color: "rgba(110,100,170,0.45)" }}>
                    Logged
                  </span>
                </div>
                <Battery level={YESTERDAY_ENERGY} />
                <div className="flex flex-col items-center gap-1">
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: "-1px", color: "rgba(110,100,170,0.38)" }}>
                    {YESTERDAY_ENERGY}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(110,100,170,0.38)" }}>/ 7</span>
                  <span style={{ fontSize: 10, color: "rgba(110,100,170,0.3)", letterSpacing: "0.05em", fontWeight:"bold", textTransform: "uppercase", marginTop: 2 }}>Read only</span>
                </div>
              </BatteryRow>

              <BatteryRow isToday>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(99,102,241,0.6)" }}>Today</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 800, fontStyle: "italic", color: "rgba(90,80,160,0.4)" }}>
                    {formatDate(today)}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={state.today > 0 ? "saved" : "tap"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginTop: 6, display: "inline-block", padding: "3px 10px", borderRadius: 100, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)", color: "rgba(99,102,241,0.7)" }}
                    >
                      {state.today > 0 ? "Auto-saved ✓" : "Tap to set"}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <Battery level={state.today} isToday />
                <div className="flex flex-col items-center gap-2">
                  <motion.span
                    key={state.today}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 600, lineHeight: 1, letterSpacing: "-1px",
                      background: state.today > 0 ? "linear-gradient(160deg,#6366f1,#22d3ee)" : "none",
                      WebkitBackgroundClip: state.today > 0 ? "text" : undefined,
                      WebkitTextFillColor: state.today > 0 ? "transparent" : "rgba(110,100,170,0.38)",
                      backgroundClip: state.today > 0 ? "text" : undefined,
                    }}
                  >
                    {state.today || "0"}
                  </motion.span>
                  <span style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(110,100,170,0.38)" }}>/ 7</span>
                  <TapDots value={state.today} onChange={setTodayEnergy} />
                </div>
              </BatteryRow>

              <BatteryRow onClick={cycleTomorrow}>
                <div className="flex flex-col gap-1" >
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(110,100,170,0.45)" }}>Tomorrow</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 800, fontStyle: "italic", color: "rgba(90,80,160,0.4)" }}>
                    {formatDate(tomorrow)}
                  </span>
                  <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 6, display: "inline-block", padding: "3px 10px", borderRadius: 100, background: "rgba(255,255,255,0.3)", border: "1px dashed rgba(180,170,220,0.45)", color: "rgba(110,100,170,0.4)" }}>
                    Intention
                  </span>
                </div>
                <Battery level={state.tomorrow} opacity={0.8} />
                <div className="flex flex-col items-center gap-1">
                  <span style={{
                    fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 200, lineHeight: 1, letterSpacing: "-1px",
                    background: state.tomorrow > 0 ? "linear-gradient(160deg,#6366f1,#22d3ee)" : "none",
                    WebkitBackgroundClip: state.tomorrow > 0 ? "text" : undefined,
                    WebkitTextFillColor: state.tomorrow > 0 ? "transparent" : "rgba(110,100,170,0.38)",
                    backgroundClip: state.tomorrow > 0 ? "text" : undefined,
                  }}>
                    {state.tomorrow || "—"}
                  </span>
                  <span style={{ fontSize: 12, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(110,100,170,0.38)" }}>/ 7</span>
                  <span style={{ fontSize: 8, color: "rgba(110,100,170,0.3)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 2, textAlign: "center", lineHeight: 1.6 }}>
                    Tap row<br />to set
                  </span>
                </div>
              </BatteryRow>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between gap-4">
              <motion.button
                onClick={handleSave}
                disabled={state.today === 0}
                className="flex-1 rounded-full py-3 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: justSaved
                    ? "linear-gradient(135deg,rgba(52,211,153,0.18),rgba(52,211,153,0.1))"
                    : "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(34,211,238,0.1))",
                  border: justSaved
                    ? "1px solid rgba(52,211,153,0.4)"
                    : "1px solid rgba(99,102,241,0.28)",
                  backdropFilter: "blur(20px)",
                  boxShadow: justSaved
                    ? "0 0 24px rgba(52,211,153,0.15),inset 0 1px 0 rgba(255,255,255,0.8)"
                    : "0 8px 32px rgba(99,102,241,0.12),inset 0 1px 0 rgba(255,255,255,0.8)",
                }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={justSaved ? "saved" : "log"}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase",
                      color: justSaved ? "rgba(52,211,153,0.9)" : "rgba(99,102,241,0.75)",
                    }}
                  >
                    {justSaved ? "✓ Energy Logged" : "Log Energy"}
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              <GlassPillBtn
                onClick={() => router.push(`/${locale}/energy-archive`)}
                style={{ padding: "10px 20px", flexShrink: 0 }}
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="rgba(99,102,241,0.55)" strokeWidth="1.2"/>
                  <path d="M7 4v3.5l2 1.5" stroke="rgba(99,102,241,0.55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(99,102,241,0.65)" }}>
                  View History
                </span>
                <span style={{ fontSize: 15, color: "rgba(99,102,241,0.4)" }}>›</span>
              </GlassPillBtn>
            </div>

          </div>
        </motion.div>
      </section>
    </>
  )
}
