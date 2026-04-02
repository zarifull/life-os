"use client"

import { useEffect, useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useTranslations, useLocale } from 'next-intl';

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime() +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60000
  return Math.floor(diff / 86400000)
}

function StatCard({
  value,
  label,
  isCenter = false,
  delay = 0,
}: {
  value: number
  label: string
  isCenter?: boolean
  delay?: number
}) {
  const t = useTranslations("year")
  
  return (
    <motion.div
      className="flex flex-col items-center gap-1 sm:gap-3 py-4 sm:py-7 px-1 sm:px-4 rounded-[22px] sm:rounded-[28px] mx-0.5 sm:mx-2 cursor-default backdrop-blur-xl"
      style={{
        background: isCenter ? "rgba(255,255,255,0.52)" : "rgba(255,255,255,0.42)",
        border: isCenter
          ? "1px solid rgba(255,255,255,0.82)"
          : "1px solid rgba(255,255,255,0.68)",
        backdropFilter: "blur(40px) saturate(160%)",
        WebkitBackdropFilter: "blur(40px) saturate(160%)",
        boxShadow: isCenter
          ? "0 12px 48px rgba(99,102,241,0.1),0 4px 16px rgba(34,211,238,0.06),inset 0 2px 0 rgba(255,255,255,1),inset 0 -1px 0 rgba(180,170,220,0.1)"
          : "0 6px 28px rgba(120,100,200,0.06),inset 0 1.5px 0 rgba(255,255,255,0.95),inset 0 -1px 0 rgba(180,170,220,0.08)",
        willChange: "transform, opacity",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -3, background: isCenter ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.55)" }}
    >
      {isCenter && (
        <div
          className="inline-flex items-center gap-[3px] sm:gap-[5px] rounded-full py-0.5 sm:py-1 px-2 sm:px-3 mb-1 sm:mb-0"
          style={{
            background: "rgba(255,255,255,0.62)",
            border: "1px solid rgba(255,255,255,0.88)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.92)",
          }}
        >
          <motion.div
            className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg,#6366f1,#22d3ee)" }}
            animate={{ opacity: [1, 0.5, 1], scale: [1, 0.75, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="text-[7px] sm:text-[9px] font-medium tracking-[0.2em] sm:tracking-[0.35em] uppercase"
            style={{ color: "rgba(99,102,241,0.65)" }}
          >
            {t("today")}
          </span>
        </div>
      )}

      <motion.span
        className={`font-serif font-light leading-none ${
          isCenter
            ? "text-[44px] sm:text-[100px] tracking-[-2px] sm:tracking-[-5px]"
            : "text-[34px] sm:text-[80px] tracking-[-1px] sm:tracking-[-4px]"
        }`}
        style={
          isCenter
            ? {
                background: "linear-gradient(160deg,#3730a3,#6366f1 45%,#22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 16px rgba(99,102,241,0.22))",
              }
            : { color: "rgba(118,108,178,0.44)" }
        }
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {value}
      </motion.span>

      <span
        className="text-[7px] sm:text-[10px] font-normal tracking-[0.2em] sm:tracking-[0.45em] uppercase text-center"
        style={{ color: isCenter ? "rgba(99,102,241,0.46)" : "rgba(110,100,170,0.34)" }}
      >
        {t(`stats.${label}`)}
      </span>
    </motion.div>
  )
}

export default function YearSection() {
  const t = useTranslations('year'); 
  const locale = useLocale();
  const [mounted, setMounted] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const data = useMemo(() => {
    const y = now.getFullYear()
    const total = isLeapYear(y) ? 366 : 365
    const day = getDayOfYear(now)
    const pct = Math.round((day / total) * 100)
    
    return {
      year: y,
      total,
      day,
      lived: day - 1,
      ahead: total - day,
      pct,
      date: now.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
      time: String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0")
    }
  }, [now])

  if (!mounted) return null

  return (
    <section className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-[32px] sm:rounded-[44px] p-[2px] sm:p-[3px]"
        style={{
          background:
            "linear-gradient(145deg,rgba(255,255,255,0.9) 0%,rgba(255,255,255,0.42) 22%,rgba(220,210,255,0.2) 50%,rgba(200,185,255,0.48) 78%,rgba(135,215,255,0.52) 100%)",
          boxShadow:
            "0 40px 120px rgba(120,100,200,0.15),0 8px 32px rgba(0,0,0,0.06),inset 0 2px 0 rgba(255,255,255,1)",
        }}
      >
        <div
          className="relative rounded-[30px] sm:rounded-[42px] overflow-hidden px-4 sm:px-[52px] py-10 sm:pt-[64px] sm:pb-[56px]"
          style={{
            background:
              "linear-gradient(145deg,#ece9ff 0%,#f3eeff 22%,#ffe8f8 52%,#e8f0ff 78%,#e4f5ff 100%)",
            backdropFilter: "blur(60px) saturate(180%)",
            WebkitBackdropFilter: "blur(60px) saturate(180%)",
            border: "0.5px solid rgba(255,255,255,0.6)",
          }}
        >
          <motion.div
            className="absolute top-0 bottom-0 w-[32%] pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg,transparent 25%,rgba(255,255,255,0.2) 50%,transparent 75%)",
              transform: "skewX(-12deg)",
              willChange: "left", 
            }}
            animate={{ left: ["-60%", "130%", "-60%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", times: [0, 0.42, 1] }} 
          />

          <motion.div
            className="text-center mb-8 sm:mb-[52px] relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-[5px] sm:gap-[7px] rounded-full px-4 sm:px-5 py-1 sm:py-1.5 mb-4 sm:mb-6"
              style={{
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(255,255,255,0.88)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 2px 16px rgba(120,100,200,0.08),inset 0 1px 0 rgba(255,255,255,0.95)",
              }}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-1 sm:w-[7px] h-1 sm:h-[7px] rounded-full"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#22d3ee)",
                  boxShadow: "0 0 10px rgba(99,102,241,0.7)",
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span
                className="text-[9px] sm:text-[11px] font-medium tracking-[0.3em] sm:tracking-[0.4em] uppercase"
                style={{ color: "rgba(60,52,137,0.7)" }}
              >
                {data.year}
              </span>
            </motion.div>

            <motion.span
              className="block font-serif font-extralight leading-[0.88] text-[80px] sm:text-[160px]"
              style={{
                letterSpacing: "-4px",
                background:
                  "linear-gradient(160deg,#3730a3 0%,#5454cc 32%,#7b7ce6 60%,#22d3ee 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 4px 24px rgba(99,102,241,0.14))",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {data.total}
            </motion.span>

            <span
              className="block text-[9px] sm:text-[11px] font-normal tracking-[0.4em] sm:tracking-[0.55em] uppercase mt-2 sm:mt-[10px]"
              style={{ color: "rgba(110,100,180,0.38)" }}
            >
              {t("days_label")}
            </span>
          </motion.div>

          <motion.div
            className="w-full h-px mb-8 sm:mb-[52px] relative z-10"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(180,168,220,0.35) 28%,rgba(180,168,220,0.42) 50%,rgba(180,168,220,0.35) 72%,transparent)",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />

          <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr] items-center gap-0 relative z-10">
            <StatCard value={data.lived} label="lived"       delay={0.5} />
            <div
              className="w-px h-10 sm:h-20 shrink-0"
              style={{ background: "linear-gradient(to bottom,transparent,rgba(255,255,255,0.6),transparent)" }}
            />
            <StatCard value={data.day}   label="current day" delay={0.6} isCenter />
            <div
              className="w-px h-10 sm:h-20 shrink-0"
              style={{ background: "linear-gradient(to bottom,transparent,rgba(255,255,255,0.6),transparent)" }}
            />
            <StatCard value={data.ahead} label="ahead"       delay={0.7} />
          </div>

          <motion.div
            className="mt-10 sm:mt-12 relative z-10 flex flex-col items-center gap-4 sm:gap-[18px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="flex items-center gap-3 sm:gap-[14px]">
              <span
                className="font-serif text-base sm:text-[22px] font-light italic tracking-[0.06em]"
                style={{ color: "rgba(96,86,158,0.38)" }}
              >
                {data.date}
              </span>
              <div
                className="w-1 h-1 rounded-full"
                style={{ background: "rgba(130,120,180,0.25)" }}
              />
              <span
                className="font-serif text-base sm:text-[22px] font-light tracking-[0.1em] sm:tracking-[0.18em] tabular-nums"
                style={{ color: "rgba(96,86,158,0.38)" }}
              >
                {data.time}
              </span>
            </div>

            <div className="w-full">
              <div
                className="w-full p-[2px] rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg,rgba(255,255,255,0.7),rgba(180,170,220,0.25),rgba(255,255,255,0.7))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                <div
                  className="h-[5px] rounded-full relative overflow-visible"
                  style={{ background: "rgba(200,195,230,0.25)" }}
                >
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg,#6366f1,#a78bfa 50%,#22d3ee)",
                      boxShadow: "0 0 14px rgba(99,102,241,0.45)",
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: `${data.pct}%` }}
                    transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-1/2 rounded-full"
                      style={{ background: "rgba(255,255,255,0.35)" }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute top-1/2 w-[10px] sm:w-[13px] h-[10px] sm:h-[13px] rounded-full bg-white"
                    style={{
                      border: "2px solid rgba(99,102,241,0.7)",
                      boxShadow: "0 0 16px rgba(99,102,241,0.55),0 0 6px rgba(99,102,241,0.3)",
                      transform: "translate(-50%,-50%)",
                    }}
                    initial={{ left: "0%" }}
                    animate={{ left: `${data.pct}%` }}
                    transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
                  />
                </div>
              </div>
              <div className="flex justify-between mt-2 sm:mt-[10px]">
                <span
                  className="text-[8px] sm:text-[9px] font-normal tracking-[0.15em] sm:tracking-[0.25em] uppercase"
                  style={{ color: "rgba(99,102,241,0.25)" }}
                >
                  {t("jan_1")}
                </span>
                <motion.span
                  className="text-[8px] sm:text-[9px] font-normal tracking-[0.15em] sm:tracking-[0.25em] uppercase"
                  style={{ color: "rgba(99,102,241,0.42)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                >
                 {data.pct}% {t("complete")}
                </motion.span>
                <span
                  className="text-[8px] sm:text-[9px] font-normal tracking-[0.15em] sm:tracking-[0.25em] uppercase"
                  style={{ color: "rgba(99,102,241,0.25)" }}
                >
                  {t("dec_31")}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}