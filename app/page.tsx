"use client";

import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function PinCodePage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false); 
  const dots = [0, 1, 2, 3];

  const verifyPin = useCallback(async (currentPin: string) => {
    if (isVerifying) return;
    setIsVerifying(true);
  
    try {  
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
  
      if (error) {
        console.error("Supabase катасы:", error.message);
        alert("Базага туташуу мүмкүн эмес");
        return;
      }  
      const matchedUser = data?.find((user: any) => String(user.pin_code).trim() === currentPin.trim());
  
      if (matchedUser) {
        // console.log("Ийгилик! Колдонуучу табылды.");
        router.push("/dashboard");
      } else {
        console.warn("ПИН дал келген жок.");
        alert("ПИН-код ката!");
        setPin(""); 
      }
    } catch (err) {
      console.error("Күтүлбөгөн техникалык ката:", err);
    } finally {
      setIsVerifying(false);
    }
  }, [isVerifying, router]);

  useEffect(() => {
    if (pin.length === 4) {
      verifyPin(pin);
    }
  }, [pin]);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + num);
    }
  };

  const clearPin = () => setPin("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="glass-card p-10 rounded-[40px] w-80 flex flex-col items-center shadow-2xl bg-white/30 backdrop-blur-md border border-white/20">
        <h2 className="text-gray-700 font-medium mb-8 text-lg">Кодду киргизиңиз</h2>

        <div className="flex gap-4 mb-10">
          {dots.map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 border-white/50 transition-all duration-300 ${
                pin.length > i ? "bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] scale-125" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map((btn) => (
            <button
              key={btn}
              disabled={isVerifying}
              onClick={() => {
                if (btn === "C") clearPin();
                else if (btn === "OK") { if(pin.length === 4) verifyPin(pin); }
                else handleNumberClick(btn);
              }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-semibold text-gray-600 bg-white/40 hover:bg-white/60 active:scale-90 transition-all border border-white/30 shadow-sm"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-sm text-gray-500 italic">Сиздин коопсуз мейкиндигиңиз</p>
    </div>
  );
}