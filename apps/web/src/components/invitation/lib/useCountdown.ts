import { useEffect, useState } from "react";
import { parse } from "date-fns";
import { uk } from "date-fns/locale";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const FALLBACK = new Date("2025-06-15T16:00:00");

const parseWeddingDate = (input: string): Date => {
  try {
    const parsed = parse(input, "d MMMM yyyy", new Date(), { locale: uk });
    if (!isNaN(parsed.getTime())) return parsed;
  } catch {
    // fall through to fallback parsing below
  }
  const fallback = new Date(input);
  return isNaN(fallback.getTime()) ? FALLBACK : fallback;
};

const compute = (target: Date): TimeLeft => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

export const useCountdown = (weddingDate: string): TimeLeft => {
  const target = parseWeddingDate(weddingDate);
  const [timeLeft, setTimeLeft] = useState(() => compute(target));

  useEffect(() => {
    const next = parseWeddingDate(weddingDate);
    setTimeLeft(compute(next));
    const timer = setInterval(() => setTimeLeft(compute(next)), 1000);
    return () => clearInterval(timer);
  }, [weddingDate]);

  return timeLeft;
};
