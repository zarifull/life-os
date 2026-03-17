"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const PIN_LENGTH = 4;

const locales = [
  { code: "en", label: "English" },
  { code: "kg", label: "Кыргызча" },
  { code: "ru", label: "Русский" }
];

export function LifeOSShell({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [portalHost, setPortalHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalHost(document.body);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("lifeos-unlocked") === "true") {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) {
      sessionStorage.setItem("lifeos-unlocked", "true");
    }
  }, [unlocked]);

  const activeLocale = useMemo(
    () => locales.find((l) => l.code === locale) ?? locales[0],
    [locale]
  );

  const handleDigit = (digit: string) => {
    if (unlocked) return;
    setError("");
    setPin((prev) => (prev.length >= PIN_LENGTH ? prev : prev + digit));
  };

  const handleDelete = () => {
    if (unlocked) return;
    setError("");
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (unlocked) return;
    setError("");
    setPin("");
  };

  useEffect(() => {
    const verify = async () => {
      if (pin.length !== PIN_LENGTH || unlocked) return;
      setLoading(true);
      try {
        const res = await fetch("/api/pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin })
        });
        if (!res.ok) {
          setError("Incorrect PIN");
          setPin("");
          return;
        }
        const data = await res.json();
        if (data?.ok) {
          setUnlocked(true);
        } else {
          setError("Incorrect PIN");
          setPin("");
        }
      } catch {
        setError("Unable to verify PIN");
        setPin("");
      } finally {
        setLoading(false);
      }
    };
    void verify();
  }, [pin, unlocked]);

  const handleLocaleChange = (code: string) => {
    if (code === locale) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${code}`);
      return;
    }
    segments[0] = code;
    const nextPath = `/${segments.join("/")}`;
    router.push(nextPath);
  };

  const pinOverlay =
    !unlocked && portalHost
      ? createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-500/10 backdrop-blur-[40px] pointer-events-auto">
            {/* Liquid mesh background spots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-purple-200/30 blur-[120px] rounded-full animate-pulse" />
              <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-cyan-200/30 blur-[70px] rounded-full animate-pulse delay-1000" />
            </div>

            {/* Main Glass Card */}
            <div className="relative pointer-events-auto max-w-[380px] w-full mx-6 p-[10px] rounded-[50px] bg-gradient-to-b from-white/90 to-white/10 shadow-[0_50px_200px_-20px_rgba(0,0,0,0.12)]">
              <div className="relative bg-white/20 backdrop-blur-[50px] rounded-[48.5px] px-8 pt-12 pb-10 flex flex-col items-center border-[3px] border-solid border-white/60">
                
                <div className="mb-10 text-center space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400/80">Secure Access</p>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Unlock LifeOS</h1>
                </div>

                {/* Explicit PIN Dots */}
                <div className="flex gap-5 mb-12">
                  {Array.from({ length: PIN_LENGTH }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-4 w-4 rounded-full transition-all duration-500 shadow-inner ${
                        i < pin.length
                          ? "bg-gradient-to-br from-indigo-400 to-cyan-400 scale-125 shadow-[0_0_15px_rgba(129,140,248,0.5)]"
                          : "bg-white/50 border border-white/80"
                      }`}
                    />
                  ))}
                </div>

                {error && (
                  <p className="absolute top-[165px] text-[10px] font-black text-rose-500/90 uppercase tracking-widest animate-bounce">
                    {error}
                  </p>
                )}

                {/* Explicit Liquid Keypad */}
                <div className="grid grid-cols-3 gap-5 mb-10">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((label) => {
                    const onPress =
                      label === "C" ? handleClear : label === "⌫" ? handleDelete : () => handleDigit(label);
                    const isSpecial = label === "C" || label === "⌫";

                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={onPress}
                        className={`group relative h-16 w-16 rounded-[22px] flex items-center justify-center text-lg font-bold transition-all active:scale-90
                          ${
                            isSpecial
                              ? "bg-white/40 text-slate-400 hover:bg-white/60 shadow-sm border border-white/40"
                              : "bg-gradient-to-br from-white/95 via-white/80 to-blue-50/50 text-slate-700 shadow-[0_12px_24px_-5px_rgba(0,0,0,0.05)] border border-white/80 hover:shadow-lg"
                          }
                        `}
                      >
                        {/* Internal Glossy Sheen */}
                        {!isSpecial && (
                          <div className="absolute inset-0 rounded-[22px] bg-gradient-to-tr from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                        <span className="relative z-10">{label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400 animate-spin border-t-transparent border-2" : "bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"}`} />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {loading ? "Verifying..." : "System Encrypted"}
                  </p>
                </div>
              </div>
            </div>
          </div>,
          portalHost
        )
      : null;

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-blue-100">
      {/* Mesh Background */}
      <div className="fixed inset-0 -z-10 bg-[#f9fafb]">
        <div className="absolute top-[-15%] right-[-10%] w-[700px] h-[700px] bg-blue-100/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[700px] h-[700px] bg-emerald-50/50 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-4 group cursor-default">
          <div className="h-12 w-12 bg-white/60 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.03)] border border-white/80 transition-transform group-hover:scale-105">
            <span className="text-xs font-black text-slate-400 tracking-tighter">OS</span>
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">LifeOS</h2>
            <p className="text-sm font-bold text-slate-700">Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Energy Widget */}
          <div className="hidden sm:flex items-center gap-4 px-6 py-3 bg-white/50 backdrop-blur-xl rounded-[24px] border border-white/80 shadow-sm">
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/80">Energy</span>
            <div className="flex gap-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-2.5 h-4 bg-gradient-to-b from-blue-300 to-blue-500 rounded-full animate-pulse shadow-[0_4px_10px_rgba(56,189,248,0.3)]" />
              ))}
            </div>
          </div>

          {/* Lang Picker */}
          <div className="relative">
            <select
              value={activeLocale.code}
              onChange={(e) => handleLocaleChange(e.target.value)}
              className="bg-white/60 backdrop-blur-xl px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border border-white/80 cursor-pointer appearance-none outline-none hover:bg-white/90 transition-all shadow-sm"
            >
              {locales.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 px-6 md:px-12">
        {children}
      </main>

      {pinOverlay}
    </div>
  );
}