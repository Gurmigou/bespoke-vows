import { useState, useEffect } from "react";
import type { InvitationData } from "@/pages/Builder";
import storyPhoto1 from "@/img/story-photo-1.jpg";
import storyPhoto2 from "@/img/story-photo-2.jpg";
import { parse } from "date-fns";
import { uk } from "date-fns/locale";

interface Props {
  data: InvitationData;
}

const parseWeddingDate = (dateString: string) => {
  try {
    const parsed = parse(dateString, "d MMMM yyyy", new Date(), { locale: uk });
    if (!isNaN(parsed.getTime())) return parsed;
  } catch {}
  const fallback = new Date(dateString);
  if (!isNaN(fallback.getTime())) return fallback;
  return new Date("2025-06-15T16:00:00");
};

const PINK_BG = "#FFF1F2";
const PINK_SOFT = "#FCE7F3";
const PINK_ACCENT = "#EC4899";

export const ModernTemplate = ({ data }: Props) => {
  const weddingDate = parseWeddingDate(data.weddingDate);

  const calculateTimeLeft = () => {
    const difference = weddingDate.getTime() - new Date().getTime();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [data.weddingDate]);

  const fallbackPhotos = [storyPhoto1, storyPhoto2];
  const storyMoments = data.loveStory.moments
    .map((m, i) => ({
      image: m.image || fallbackPhotos[i % fallbackPhotos.length],
      title: m.title,
      text: m.description,
      position: m.imagePosition,
    }))
    .filter((m) => m.text?.trim() || m.title?.trim());

  const textColor = data.templateColors.text;
  const accent = data.templateColors.accent || PINK_ACCENT;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Cormorant+Garamond:wght@300;400;500&display=swap');
          .modern-sans { font-family: "Inter", sans-serif; }
          .modern-display { font-family: "Cormorant Garamond", serif; font-weight: 300; letter-spacing: -0.02em; }
        `}
      </style>
      <div
        className="h-screen overflow-y-auto modern-sans"
        style={{ backgroundColor: PINK_BG, color: textColor }}
      >
        {/* Hero — split layout */}
        <section className="min-h-screen grid md:grid-cols-2">
          <div className="flex flex-col justify-center px-8 md:px-16 py-16 space-y-10">
            <div className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: accent }}>
              Save the date
            </div>
            <h1
              className="modern-display text-6xl md:text-7xl lg:text-8xl leading-[0.9]"
              style={{ color: textColor }}
            >
              {data.herName}
              <br />
              <span style={{ color: accent }}>&amp;</span>
              <br />
              {data.hisName}
            </h1>
            <div className="space-y-3 pt-6">
              <div className="text-xs tracking-[0.3em] uppercase opacity-70">{data.weddingDate}</div>
              <div className="text-xs tracking-[0.3em] uppercase opacity-70">{data.weddingPlace}</div>
            </div>
          </div>
          <div className="hidden md:block relative" style={{ backgroundColor: PINK_SOFT }}>
            <div className="absolute inset-8 border" style={{ borderColor: `${accent}40` }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="modern-display text-[14rem] leading-none" style={{ color: `${accent}30` }}>
                ∞
              </div>
            </div>
          </div>
        </section>

        {/* Countdown — solid pink, geometric */}
        <section className="py-20 px-6" style={{ backgroundColor: PINK_SOFT }}>
          <div className="max-w-3xl mx-auto text-center space-y-12">
            <div className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: accent }}>
              The countdown
            </div>
            <h2 className="modern-display text-4xl md:text-5xl" style={{ color: textColor }}>
              Until we say "так"
            </h2>
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {[
                { value: timeLeft.days, label: 'Днів' },
                { value: timeLeft.hours, label: 'Годин' },
                { value: timeLeft.minutes, label: 'Хвилин' },
                { value: timeLeft.seconds, label: 'Секунд' },
              ].map((unit) => (
                <div key={unit.label} className="border p-4 md:p-6" style={{ borderColor: `${accent}40`, backgroundColor: PINK_BG }}>
                  <div className="text-3xl md:text-5xl font-light tabular-nums" style={{ color: textColor }}>
                    {String(unit.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] tracking-[0.3em] uppercase mt-2 opacity-60">{unit.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Love story — single column, minimal */}
        {storyMoments.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-3xl mx-auto space-y-16">
              <div className="text-center space-y-4">
                <div className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: accent }}>
                  Our story
                </div>
                <h2 className="modern-display text-4xl md:text-5xl">Наша історія</h2>
              </div>
              <div className="space-y-12">
                {storyMoments.map((moment, idx) => (
                  <div key={idx} className="grid md:grid-cols-5 gap-8 items-center">
                    <div className="md:col-span-2">
                      <div className="aspect-square overflow-hidden">
                        <img src={moment.image} alt={`Момент ${idx + 1}`} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" style={{ objectPosition: `${moment.position?.x ?? 50}% ${moment.position?.y ?? 50}%` }} />
                      </div>
                    </div>
                    <div className="md:col-span-3 space-y-3">
                      <div className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: accent }}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      {moment.title && (
                        <h3 className="modern-display text-2xl md:text-3xl" style={{ color: textColor }}>
                          {moment.title}
                        </h3>
                      )}
                      {moment.text && (
                        <p className="text-base md:text-lg font-light leading-relaxed" style={{ color: textColor }}>
                          {moment.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Colors — squares */}
        {data.weddingColors.length > 0 && (
          <section className="py-20 px-6" style={{ backgroundColor: PINK_SOFT }}>
            <div className="max-w-2xl mx-auto text-center space-y-10">
              <div className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: accent }}>
                Palette
              </div>
              <h2 className="modern-display text-4xl md:text-5xl">Кольори</h2>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {data.weddingColors.map((hex, idx) => (
                  <div key={idx} className="w-20 h-28 md:w-24 md:h-32 flex-shrink-0" style={{ backgroundColor: hex }} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Events — numbered list */}
        {data.events.length > 0 && (
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto space-y-10">
              <div className="text-center space-y-4">
                <div className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: accent }}>
                  Schedule
                </div>
                <h2 className="modern-display text-4xl md:text-5xl">Програма</h2>
              </div>
              <div className="space-y-0">
                {data.events.map((event, idx) => (
                  <div
                    key={event.id}
                    className="py-5 border-b"
                    style={{ borderColor: `${textColor}15` }}
                  >
                    <div className="grid grid-cols-[auto_1fr_auto] gap-6 items-baseline">
                      <span className="text-[10px] tracking-[0.3em] opacity-50 tabular-nums">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm md:text-base font-light tracking-wide">
                        {event.eventName}
                      </span>
                      <span className="text-sm md:text-base tabular-nums font-medium" style={{ color: accent }}>
                        {event.time}
                      </span>
                    </div>
                    {event.comment && (
                      <p className="text-sm italic mt-2 ml-10 opacity-60 text-left">
                        {event.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Venue */}
        <section className="py-24 px-6 text-center" style={{ backgroundColor: PINK_SOFT }}>
          <div className="max-w-xl mx-auto space-y-8">
            <div className="text-[10px] tracking-[0.4em] uppercase font-medium" style={{ color: accent }}>
              Venue
            </div>
            <h2 className="modern-display text-4xl md:text-5xl">Місце проведення</h2>
            <div className="h-px w-12 mx-auto" style={{ backgroundColor: accent }} />
            <p className="text-sm tracking-[0.2em] uppercase font-light">{data.weddingPlace}</p>
            {data.venue?.label && (
              data.venue.mapsUrl ? (
                <a
                  href={data.venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
                  style={{ color: accent }}
                >
                  {data.venue.label} ↗
                </a>
              ) : (
                <p className="text-sm font-light opacity-70">{data.venue.label}</p>
              )
            )}
            <p className="modern-display text-2xl md:text-3xl pt-6" style={{ color: accent }}>
              Чекаємо на вас
            </p>
          </div>
        </section>
      </div>
    </>
  );
};
