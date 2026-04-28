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

const BROWN_BG = "#FAF6F0";
const BROWN_SOFT = "#EFE4D2";
const BROWN_DEEP = "#3E2723";
const BROWN_ACCENT = "#8D6E63";

const Ornament = ({ color }: { color: string }) => (
  <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
    <span className="h-px w-12" style={{ backgroundColor: color, opacity: 0.4 }} />
    <span className="text-lg" style={{ color }}>❦</span>
    <span className="h-px w-12" style={{ backgroundColor: color, opacity: 0.4 }} />
  </div>
);

export const FloralTemplate = ({ data }: Props) => {
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
      reverse: i % 2 === 1,
    }))
    .filter((m) => m.text?.trim() || m.title?.trim());

  const textColor = data.templateColors.text || BROWN_DEEP;
  const accent = data.templateColors.accent || BROWN_ACCENT;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400&family=Pinyon+Script&display=swap');
          .floral-script { font-family: "Pinyon Script", cursive; }
          .floral-serif { font-family: "Cormorant Garamond", serif; }
        `}
      </style>
      <div
        className="h-screen overflow-y-auto floral-serif"
        style={{ backgroundColor: BROWN_BG, color: textColor }}
      >
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative">
          <div
            className="absolute inset-6 md:inset-12 border-2 pointer-events-none"
            style={{ borderColor: `${accent}30` }}
          />
          <div
            className="absolute inset-8 md:inset-14 border pointer-events-none"
            style={{ borderColor: `${accent}20` }}
          />
          <div className="max-w-2xl mx-auto space-y-10 relative">
            <p className="floral-serif italic text-sm md:text-base tracking-[0.25em] uppercase" style={{ color: accent }}>
              Із любов'ю запрошуємо
            </p>
            <Ornament color={accent} />
            <h1
              className="floral-script text-7xl md:text-8xl lg:text-[9rem] leading-[1.1]"
              style={{ color: textColor }}
            >
              {data.herName}
            </h1>
            <div className="floral-serif italic text-3xl md:text-4xl" style={{ color: accent }}>
              &amp;
            </div>
            <h1
              className="floral-script text-7xl md:text-8xl lg:text-[9rem] leading-[1.1]"
              style={{ color: textColor }}
            >
              {data.hisName}
            </h1>
            <Ornament color={accent} />
            <p className="floral-serif text-base md:text-lg tracking-[0.3em] uppercase font-light">
              {data.weddingDate}
            </p>
            <p className="floral-serif italic text-base md:text-lg" style={{ color: accent }}>
              {data.weddingPlace}
            </p>
          </div>
        </section>

        {/* Countdown */}
        <section className="py-20 px-6" style={{ backgroundColor: BROWN_SOFT }}>
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h2 className="floral-script text-6xl md:text-7xl" style={{ color: textColor }}>
              Лічимо дні
            </h2>
            <Ornament color={accent} />
            <div className="grid grid-cols-4 gap-4 md:gap-6">
              {[
                { value: timeLeft.days, label: 'Днів' },
                { value: timeLeft.hours, label: 'Годин' },
                { value: timeLeft.minutes, label: 'Хвилин' },
                { value: timeLeft.seconds, label: 'Секунд' },
              ].map((unit) => (
                <div key={unit.label} className="space-y-2">
                  <div
                    className="floral-serif text-4xl md:text-6xl font-light tabular-nums"
                    style={{ color: textColor }}
                  >
                    {unit.value}
                  </div>
                  <div
                    className="floral-serif italic text-xs md:text-sm tracking-[0.2em]"
                    style={{ color: accent }}
                  >
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Love Story */}
        {storyMoments.length > 0 && (
          <section className="py-24 px-6">
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="text-center">
                <h2 className="floral-script text-6xl md:text-7xl" style={{ color: textColor }}>
                  Наша історія кохання
                </h2>
                <Ornament color={accent} />
              </div>
              <div className="space-y-20">
                {storyMoments.map((moment, idx) => (
                  <div
                    key={idx}
                    className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center`}
                  >
                    <div className={`${moment.reverse ? "md:order-2" : ""}`}>
                      <div className="relative">
                        <div
                          className="absolute -inset-3 border"
                          style={{ borderColor: `${accent}40` }}
                        />
                        <img
                          src={moment.image}
                          alt={`Момент ${idx + 1}`}
                          className="relative w-full aspect-[4/5] object-cover sepia-[0.2]"
                          style={{ objectPosition: `${moment.position?.x ?? 50}% ${moment.position?.y ?? 50}%` }}
                        />
                      </div>
                    </div>
                    <div className={`space-y-4 ${moment.reverse ? "md:order-1" : ""}`}>
                      <div className="floral-script text-5xl" style={{ color: accent }}>
                        {moment.title || `Розділ ${idx + 1}`}
                      </div>
                      {moment.text && (
                        <p className="floral-serif text-base md:text-lg leading-relaxed font-light" style={{ color: textColor }}>
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

        {/* Colors */}
        {data.weddingColors.length > 0 && (
          <section className="py-20 px-6" style={{ backgroundColor: BROWN_SOFT }}>
            <div className="max-w-2xl mx-auto text-center space-y-8">
              <h2 className="floral-script text-6xl md:text-7xl" style={{ color: textColor }}>
                Палітра
              </h2>
              <Ornament color={accent} />
              <div className="flex flex-wrap justify-center items-end gap-4 md:gap-6">
                {data.weddingColors.map((hex, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2"
                      style={{ backgroundColor: hex, borderColor: `${accent}40` }}
                    />
                    <span className="floral-serif italic text-xs" style={{ color: accent }}>
                      №{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Events */}
        {data.events.length > 0 && (
          <section className="py-24 px-6">
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="floral-script text-6xl md:text-7xl" style={{ color: textColor }}>
                  Програма дня
                </h2>
                <Ornament color={accent} />
              </div>
              <div className="space-y-2">
                {data.events.map((event) => (
                  <div
                    key={event.id}
                    className="py-4 border-b"
                    style={{ borderColor: `${accent}25` }}
                  >
                    <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-baseline">
                      <span className="floral-serif italic text-lg md:text-xl" style={{ color: accent }}>
                        {event.time}
                      </span>
                      <span
                        className="h-px w-full mt-3"
                        style={{ backgroundColor: `${accent}30` }}
                      />
                      <span className="floral-serif text-lg md:text-xl font-light" style={{ color: textColor }}>
                        {event.eventName}
                      </span>
                    </div>
                    {event.comment && (
                      <p className="floral-serif italic text-base mt-2 text-left" style={{ color: accent, opacity: 0.7 }}>
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
        <section className="py-24 px-6 text-center" style={{ backgroundColor: BROWN_SOFT }}>
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="floral-script text-6xl md:text-7xl" style={{ color: textColor }}>
              Місце урочистості
            </h2>
            <Ornament color={accent} />
            <p className="floral-serif text-lg md:text-xl font-light tracking-wide">
              {data.weddingPlace}
            </p>
            {data.venue?.label && (
              data.venue.mapsUrl ? (
                <a
                  href={data.venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="floral-serif italic text-base md:text-lg underline underline-offset-4 hover:opacity-80 transition-opacity"
                  style={{ color: accent }}
                >
                  {data.venue.label} ↗
                </a>
              ) : (
                <p className="floral-serif italic text-base md:text-lg font-light" style={{ color: accent, opacity: 0.8 }}>
                  {data.venue.label}
                </p>
              )
            )}
            <p className="floral-serif italic text-lg md:text-xl pt-6" style={{ color: accent }}>
              З нетерпінням чекаємо на вас
            </p>
          </div>
        </section>
      </div>
    </>
  );
};
