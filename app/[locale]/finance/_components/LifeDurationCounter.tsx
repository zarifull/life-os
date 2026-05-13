'use client';

import React, { useState, useEffect } from 'react';

interface Props {
  birthDate: string;
}

export default function LifeDurationCounter({ birthDate }: Props) {
  const [duration, setDuration] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculate = () => {
      const birth = new Date(birthDate).getTime();
      const now = new Date().getTime();
      const diff = now - birth;

      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setDuration({ years, days, hours, minutes, seconds });
    };

    calculate(); 
    const timer = setInterval(calculate, 1000); 

    return () => clearInterval(timer); 
  }, [birthDate]);

  return (
    <div className="p-4 bg-white/50 backdrop-blur-md rounded-2xl border border-indigo-100 shadow-sm text-center">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">
        Life Progress
      </h3>
      <div className="flex justify-center gap-4 text-indigo-950 font-serif">
        <div className="flex flex-col">
          <span className="text-2xl">{duration.years}</span>
          <span className="text-[8px] uppercase tracking-tighter opacity-50">Years</span>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl">{duration.days}</span>
          <span className="text-[8px] uppercase tracking-tighter opacity-50">Days</span>
        </div>
        <div className="text-2xl self-center opacity-20">:</div>
        <div className="flex flex-col">
          <span className="text-2xl">
            {String(duration.hours).padStart(2, '0')}:
            {String(duration.minutes).padStart(2, '0')}:
            {String(duration.seconds).padStart(2, '0')}
          </span>
          <span className="text-[8px] uppercase tracking-tighter opacity-50">Time Elapsed</span>
        </div>
      </div>
    </div>
  );
}