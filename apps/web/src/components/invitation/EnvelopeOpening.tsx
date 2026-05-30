import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TemplateColors } from "@bespoke-vows/shared";

interface EnvelopeOpeningProps {
  colors: TemplateColors;
  hisName: string;
  herName: string;
  displayClass: string;
  bodyClass: string;
  /** Id of the element to align to once the envelope is unmounted. */
  scrollTargetId: string;
}

const hexWithAlpha = (hex: string, alpha: number) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (full.length !== 6) return hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const isLightHex = (hex: string) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (full.length !== 6) return false;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
};

// Shift a hex toward black (amount<0) or white (amount>0). amount in [-1, 1].
const shadeHex = (hex: string, amount: number) => {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (full.length !== 6) return hex;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const target = amount < 0 ? 0 : 255;
  const a = Math.abs(amount);
  const mix = (c: number) => Math.round(c + (target - c) * a);
  const toHex = (c: number) => c.toString(16).padStart(2, "0");
  return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
};

const findScrollableAncestor = (el: HTMLElement | null): HTMLElement | null => {
  let parent: HTMLElement | null = el?.parentElement ?? null;
  while (parent) {
    const style = window.getComputedStyle(parent);
    if (/(auto|scroll|overlay)/.test(style.overflowY)) return parent;
    parent = parent.parentElement;
  }
  return null;
};

const initialOf = (name: string) => name?.trim().charAt(0).toUpperCase() || "";

// Total scroll length of the reveal, in viewport heights.
const SECTION_VH = 250;

// TEMP: flip to compare the two intros, then delete the flag + the losing branch.
//   "flap"      — closed envelope whose flap opens, then the paper rises.
//   "preopened" — envelope already open, only the paper rises.
const OPENING_STYLE: "flap" | "preopened" = "flap";

// Smooth 0/1 crossfade with a soft ramp between `lo` and `hi`.
const smoothBand = (v: number, lo: number, hi: number) => {
  if (v <= lo) return 0;
  if (v >= hi) return 1;
  const t = (v - lo) / (hi - lo);
  return t * t * (3 - 2 * t);
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const EnvelopeOpening = ({
  colors,
  hisName,
  herName,
  displayClass,
  bodyClass,
  scrollTargetId,
}: EnvelopeOpeningProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (passed) return;
    scrollerRef.current = findScrollableAncestor(sectionRef.current);
    const scroller = scrollerRef.current;
    const section = sectionRef.current;
    if (!scroller || !section) return;

    let raf = 0;
    const update = () => {
      const scrollerRect = scroller.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const scrolled = scrollerRect.top - sectionRect.top;
      const range = section.offsetHeight - scroller.clientHeight;
      const p = range > 0 ? Math.max(0, Math.min(1, scrolled / range)) : 0;
      setProgress(p);
      if (p >= 0.999) setPassed(true);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [passed]);

  // One-way reveal: once passed, snap to the invitation top and never come back
  // this page load (the envelope section is unmounted below).
  useLayoutEffect(() => {
    if (!passed) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ top: 0, behavior: "auto" });
    const target = document.getElementById(scrollTargetId);
    if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
  }, [passed, scrollTargetId]);

  if (passed) return null;

  const isFlap = OPENING_STYLE === "flap";

  // --- Phased timeline (driven by scroll progress 0 → 1) ---
  // flap:      0.00–0.30 flap opens · 0.20–0.85 paper rises · 0.85–1.0 hand off
  // preopened: flap static-open     · 0.00–0.85 paper rises · 0.85–1.0 hand off
  const rawFlap = isFlap ? Math.max(0, Math.min(1, progress / 0.3)) : 1;
  const flapProgress = easeInOutCubic(rawFlap);

  const paperStart = isFlap ? 0.2 : 0.0;
  const rawPaper = Math.max(0, Math.min(1, (progress - paperStart) / (0.85 - paperStart)));
  const paperProgress = easeOut(rawPaper);

  // Wax seal lives on the closed flap; gone before the paper starts to rise.
  const sealProgress = easeInOut(Math.max(0, Math.min(1, progress / 0.16)));
  const sealOpacity = isFlap ? Math.max(0, 1 - sealProgress * 1.1) : 0;
  const sealScale = 1 - 0.16 * sealProgress;

  // Flap folds up and back (hinged at the top edge). Static-open for preopened.
  const FLAP_OPEN_ANGLE = -162;
  const flapAngle = FLAP_OPEN_ANGLE * flapProgress;
  const flapShadeProgress = isFlap ? flapProgress : 1;

  // Paper translateY, in % of the paper's own height. The paper is taller than
  // the envelope and clipped at the envelope bottom (see clip wrapper below), so
  // it lives *inside* and only its top emerges. Tucked (top behind the pocket
  // mouth) → risen (top well above the envelope top edge, base still tucked).
  const paperY = 43 - 70 * paperProgress;
  const paperTextOpacity = Math.max(0, Math.min(1, (paperProgress - 0.35) / 0.4));

  // Long, gentle scene fade so the wrapper is invisible by the time we unmount
  // and snap to the invitation top — no visible jump.
  const outroProgress = smoothBand(progress, 0.85, 1);
  const sceneOpacity = 1 - outroProgress;
  const sceneScale = 1 - outroProgress * 0.06;
  const sceneTranslate = -outroProgress * 24;

  const hintOpacity = Math.max(0, 1 - progress * 4);
  const finalReached = progress > 0.9;

  const SMOOTH = "transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out";

  const accent = colors.accent;
  const text = colors.text;
  const isPrimaryDark = !isLightHex(colors.primary);

  // Envelope tones derived from primary.
  const bodyTone = colors.primary;
  const flapTone = isPrimaryDark ? shadeHex(colors.primary, 0.12) : shadeHex(colors.primary, -0.05);
  const flapHighlight = isPrimaryDark ? shadeHex(colors.primary, 0.22) : shadeHex(colors.primary, 0.1);
  const flapShadow = shadeHex(colors.primary, -0.3);
  // Interior (visible in the mouth once the flap lifts) — darker than the front.
  const backTone = isPrimaryDark ? shadeHex(colors.primary, 0.05) : shadeHex(colors.primary, -0.17);
  // Front pocket — the panel that keeps the paper's base tucked inside.
  const pocketTone = bodyTone;
  const pocketShadow = shadeHex(colors.primary, -0.16);
  const pocketHighlight = isPrimaryDark ? shadeHex(colors.primary, 0.06) : shadeHex(colors.primary, 0.04);

  const sealTextColor = isLightHex(accent) ? "#111111" : "#ffffff";
  const monogram = (
    <>
      {initialOf(hisName)}
      <span className="mx-1 opacity-70">&amp;</span>
      {initialOf(herName)}
    </>
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${SECTION_VH}vh` }}
      aria-label="Envelope reveal"
    >
      <style>{`
        @keyframes envelopeFinalSway {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg); }
          25% { transform: translate3d(0, -5px, 0) rotate(-0.4deg); }
          50% { transform: translate3d(0, 4px, 0) rotate(0.3deg); }
          75% { transform: translate3d(0, -2px, 0) rotate(-0.2deg); }
        }
      `}</style>
      <div
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center px-6 overflow-hidden select-none"
        style={{
          background: `radial-gradient(ellipse at center, ${hexWithAlpha(accent, 0.22)} 0%, ${hexWithAlpha(
            colors.primary,
            0.1
          )} 55%, transparent 100%)`,
          opacity: sceneOpacity,
          transform: `translateY(${sceneTranslate}px) scale(${sceneScale})`,
          transformOrigin: "center top",
          transition: "opacity 600ms ease-out, transform 600ms ease-out",
          willChange: "opacity, transform",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${hexWithAlpha(text, 0.08)} 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            opacity: 0.35,
          }}
        />

        <div
          className={`${bodyClass} relative z-10 mb-10 text-center transition-opacity`}
          style={{ color: text, opacity: 0.85 - progress * 0.85 }}
        >
          <p className="text-[10px] md:text-xs uppercase tracking-[0.5em]">Запрошення на весілля</p>
        </div>

        <div
          className="relative z-10"
          style={{
            perspective: "1800px",
            width: "min(92vw, 540px)",
            animation: finalReached ? "envelopeFinalSway 2.6s ease-in-out infinite" : undefined,
          }}
        >
          {/* Envelope box. overflow visible so the risen paper shows above the
              top edge; strict z-order back→front keeps paper between the back
              panel and the front pocket so nothing overflows incorrectly. */}
          <div
            className="relative w-full"
            style={{ aspectRatio: "1.5 / 1", transformStyle: "preserve-3d" }}
          >
            {/* (z1) Back panel — the envelope body + visible interior. */}
            <div
              className="absolute inset-0 rounded-[6px] overflow-hidden"
              style={{
                backgroundColor: backTone,
                backgroundImage: `linear-gradient(180deg, ${shadeHex(backTone, isPrimaryDark ? 0.05 : -0.05)} 0%, ${backTone} 45%, ${shadeHex(backTone, -0.1)} 100%)`,
                boxShadow: `0 30px 60px -20px ${hexWithAlpha(colors.primary, 0.55)}, inset 0 0 0 1px ${hexWithAlpha("#000", 0.18)}`,
                zIndex: 1,
              }}
            />

            {/* (z2) Flap — top triangle hinged at the envelope top edge. */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{
                height: "58%",
                clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
                backgroundColor: flapTone,
                backgroundImage: `linear-gradient(180deg, ${flapHighlight} 0%, ${flapTone} 55%, ${flapShadow} 100%)`,
                transformOrigin: "top center",
                transform: `rotateX(${flapAngle}deg) translateZ(2px)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                transition: SMOOTH,
                willChange: "transform",
                zIndex: 2,
                filter: `brightness(${1 - flapShadeProgress * 0.05})`,
                boxShadow: `0 6px 14px ${hexWithAlpha("#000", 0.2)}, inset 0 -1px 0 ${hexWithAlpha("#000", 0.18)}, inset 0 1px 0 ${hexWithAlpha("#fff", 0.1)}`,
              }}
            />

            {/* (z3) Clip wrapper — pins the cut to the envelope bottom so the
                tall letter never spills below the envelope; open at the top so
                it can rise out. The paper inside is inset narrower than the
                pocket so it can never spill out the sides either. */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ clipPath: "inset(-400% 0 0 0)", zIndex: 3 }}
            >
              <div
                className="absolute rounded-[3px] flex flex-col items-center text-center px-6"
                style={{
                  left: "14%",
                  right: "14%",
                  top: "0%",
                  height: "130%",
                  paddingTop: "13%",
                  backgroundColor: "#fdfaf3",
                  backgroundImage: "linear-gradient(180deg, #ffffff 0%, #fdfaf3 60%, #f5efe2 100%)",
                  color: "#2a2620",
                  transform: `translateY(${paperY}%)`,
                  transition: SMOOTH,
                  willChange: "transform",
                  boxShadow: `0 14px 30px -10px ${hexWithAlpha("#000", 0.35)}, inset 0 0 0 1px ${hexWithAlpha("#000", 0.05)}`,
                }}
              >
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: paperTextOpacity,
                    transform: `translateY(${(1 - paperTextOpacity) * 8}px)`,
                    transition: "opacity 500ms ease-out, transform 500ms ease-out",
                  }}
                >
                  <span
                    className={`${displayClass} leading-none`}
                    style={{ color: "#2a2620", fontSize: "clamp(40px, 11vw, 88px)" }}
                  >
                    {monogram}
                  </span>
                  <div className="mt-5 h-px w-12" style={{ backgroundColor: hexWithAlpha(accent, 0.7) }} />
                </div>
              </div>
            </div>

            {/* (z4) Front pocket — bottom panel with a shallow V mouth. Sits in
                front of the paper so the paper's base reads as tucked inside. */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0% 42%, 50% 52%, 100% 42%, 100% 100%, 0% 100%)",
                backgroundColor: pocketTone,
                backgroundImage: `linear-gradient(180deg, ${pocketHighlight} 0%, ${pocketTone} 45%, ${pocketShadow} 100%)`,
                boxShadow: `inset 0 2px 6px ${hexWithAlpha("#000", 0.12)}`,
                zIndex: 4,
              }}
            />

            {/* (z6) Wax seal — flap variant only; fades before the paper rises. */}
            {isFlap && sealOpacity > 0.01 && (
              <div
                className="absolute rounded-full flex items-center justify-center pointer-events-none"
                style={{
                  width: "20%",
                  aspectRatio: "1",
                  top: "44%",
                  left: "50%",
                  transform: `translate3d(-50%, -50%, 8px) scale(${sealScale})`,
                  opacity: sealOpacity,
                  transition: SMOOTH,
                  willChange: "transform, opacity",
                  backgroundColor: accent,
                  backgroundImage: `radial-gradient(circle at 30% 30%, ${hexWithAlpha("#ffffff", 0.45)}, transparent 55%), radial-gradient(circle at 70% 80%, ${hexWithAlpha("#000000", 0.28)}, transparent 60%)`,
                  border: `2px solid ${hexWithAlpha(shadeHex(accent, -0.25), 0.85)}`,
                  boxShadow: `0 6px 16px ${hexWithAlpha("#000", 0.35)}, inset 0 0 0 4px ${hexWithAlpha(shadeHex(accent, 0.15), 0.6)}, inset 0 -2px 4px ${hexWithAlpha("#000", 0.25)}, inset 0 2px 4px ${hexWithAlpha("#fff", 0.25)}`,
                  zIndex: 6,
                }}
              >
                <span
                  className={`${displayClass} text-base md:text-2xl leading-none`}
                  style={{ color: sealTextColor, textShadow: `0 1px 2px ${hexWithAlpha("#000", 0.4)}` }}
                >
                  {initialOf(hisName)}
                  <span className="mx-0.5 opacity-80">&amp;</span>
                  {initialOf(herName)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* scroll hint */}
        <div className={`${bodyClass} relative z-10 mt-12 text-center min-h-[64px]`} style={{ color: text }}>
          <div
            className="absolute left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-3"
            style={{ opacity: hintOpacity, transition: "opacity 200ms linear" }}
          >
            <span className="text-[11px] md:text-xs uppercase tracking-[0.4em] opacity-80">
              Гортайте, щоб відкрити
            </span>
            <span className="block w-px h-12 animate-bounce" style={{ backgroundColor: accent }} />
          </div>
        </div>
      </div>
    </section>
  );
};
