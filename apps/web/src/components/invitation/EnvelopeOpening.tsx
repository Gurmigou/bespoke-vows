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

const SECTION_VH = 320;

// Smooth 0/1 crossfade with a soft ramp around `mid`.
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

  useLayoutEffect(() => {
    if (!passed) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ top: 0, behavior: "auto" });
    const target = document.getElementById(scrollTargetId);
    if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
  }, [passed, scrollTargetId]);

  if (passed) return null;

  // Phased timeline: seal fades first, flap opens, then card slides up.
  const rawSeal = Math.min(1, progress / 0.18);
  const rawFlap = Math.max(0, Math.min(1, (progress - 0.12) / 0.45));
  const rawCard = Math.max(0, Math.min(1, (progress - 0.4) / 0.5));

  const sealProgress = easeInOut(rawSeal);
  const flapProgress = easeInOutCubic(rawFlap);
  const cardProgress = easeOut(rawCard);

  const sealOpacity = Math.max(0, 1 - sealProgress * 1.05);
  const sealTranslateY = 18 * sealProgress; // moves slightly down as it fades
  const sealScale = 1 - 0.18 * sealProgress;

  // Two flap halves that crossfade so a flap silhouette is always on screen:
  //  - "closed" flap covers the top half of the envelope, hinged at top edge,
  //    rotating from 0° (flat closed) down to -90° (edge-on) as it opens.
  //  - "open" flap sits above the envelope, hinged at the envelope's top edge
  //    too, rotating from +90° (edge-on, hidden) to 0° (fully upright triangle
  //    pointing up).
  const closedFlapAngle = -90 * flapProgress;
  const openFlapAngle = 90 - 90 * flapProgress;
  const openOpacity = smoothBand(flapProgress, 0.42, 0.62);
  const closedOpacity = 1 - smoothBand(flapProgress, 0.42, 0.62);
  const cardY = -78 * cardProgress;
  const cardMessageOpacity = Math.max(0, Math.min(1, (cardProgress - 0.45) / 0.45));

  const hintOpacity = Math.max(0, 1 - progress * 4);
  const finalReached = progress > 0.85;
  const finalHintOpacity =
    progress > 0.8
      ? Math.max(0, Math.min(1, (progress - 0.8) / 0.08) - smoothBand(progress, 0.9, 0.98))
      : 0;
  // Long, gentle fade as the envelope hands off to the invitation. Starts
  // before scroll completes so the wrapper is invisible by the time we
  // unmount and snap to the invitation top — eliminating any visible jump.
  const outroProgress = smoothBand(progress, 0.86, 1);
  const sceneOpacity = 1 - outroProgress;
  const sceneScale = 1 - outroProgress * 0.06;
  const sceneTranslate = -outroProgress * 24;
  const flapShadowOpacity = Math.min(1, flapProgress * 1.4);
  const SMOOTH = "transform 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease-out";
  const SMOOTH_CARD =
    "transform 1100ms cubic-bezier(0.22, 1, 0.36, 1) 120ms, opacity 700ms ease-out 120ms";

  const accent = colors.accent;
  const text = colors.text;
  const isPrimaryDark = !isLightHex(colors.primary);

  // Three distinct envelope tones derived from primary.
  // Body (back panel + side/bottom folds) = main tone.
  // Flap = lighter (catches light from above).
  // Inside = darker (deep interior visible behind X seam).
  const bodyTone = colors.primary;
  const flapTone = isPrimaryDark
    ? shadeHex(colors.primary, 0.14)
    : shadeHex(colors.primary, -0.06);
  const flapHighlight = isPrimaryDark
    ? shadeHex(colors.primary, 0.24)
    : shadeHex(colors.primary, 0.1);
  const flapShadow = shadeHex(colors.primary, -0.32);
  const innerShadow = shadeHex(colors.primary, -0.55);
  // Back panel = the visible "inside" of the envelope behind the X folds.
  // Use the template's primary colour (slightly darker on light primaries
  // so it still reads as deeper/inside, but never close to black).
  const backTone = isPrimaryDark
    ? shadeHex(colors.primary, 0.04)
    : shadeHex(colors.primary, -0.18);
  const foldShadow = shadeHex(colors.primary, -0.18);
  const foldHighlight = isPrimaryDark
    ? shadeHex(colors.primary, 0.06)
    : shadeHex(colors.primary, -0.02);

  const isPrimaryLight = isLightHex(colors.primary);
  const namesColor = isPrimaryLight
    ? hexWithAlpha("#1a1a1a", 0.85)
    : hexWithAlpha("#fdfaf3", 0.92);
  const sealTextColor = isLightHex(accent) ? "#111111" : "#ffffff";
  const seamColor = hexWithAlpha("#000", 0.32);

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
          25% { transform: translate3d(0, -6px, 0) rotate(-0.5deg); }
          50% { transform: translate3d(0, 4px, 0) rotate(0.4deg); }
          75% { transform: translate3d(0, -3px, 0) rotate(-0.3deg); }
        }
        @keyframes envelopeFinalHintBob {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 1; }
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
          className={`${bodyClass} relative z-10 mb-8 text-center transition-opacity`}
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
          <div
            className="relative w-full"
            style={{
              aspectRatio: "1.5 / 1",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Back panel — uses the template's primary color (slightly
                darker than the front folds to read as the inside of the
                envelope behind the X folds) */}
            <div
              className="absolute inset-0 rounded-[6px] overflow-hidden"
              style={{
                backgroundColor: backTone,
                backgroundImage: `linear-gradient(180deg, ${shadeHex(backTone, isPrimaryDark ? 0.04 : -0.05)} 0%, ${backTone} 55%, ${shadeHex(backTone, isPrimaryDark ? -0.06 : -0.1)} 100%)`,
                boxShadow: `0 30px 60px -20px ${hexWithAlpha(colors.primary, 0.55)}, inset 0 0 0 1px ${hexWithAlpha("#000", 0.18)}`,
                zIndex: 1,
              }}
            />

            {/* White invitation card — slides up from inside.
                Sits above back panel, below the front X folds. */}
            <div
              className="absolute rounded-[3px] flex flex-col items-center justify-center text-center px-6"
              style={{
                left: "6%",
                right: "6%",
                top: "10%",
                bottom: "10%",
                backgroundColor: "#fdfaf3",
                backgroundImage:
                  "linear-gradient(180deg, #ffffff 0%, #fdfaf3 60%, #f5efe2 100%)",
                color: "#2a2620",
                transform: `translateY(${cardY}%)`,
                transition: SMOOTH_CARD,
                willChange: "transform",
                zIndex: cardProgress > 0 ? 35 : 5,
                boxShadow: `0 14px 30px -10px ${hexWithAlpha("#000", 0.35)}, inset 0 0 0 1px ${hexWithAlpha("#000", 0.05)}`,
              }}
            >
              <div
                className="flex flex-col items-center"
                style={{
                  opacity: cardMessageOpacity,
                  transform: `translateY(${(1 - cardMessageOpacity) * 6}px)`,
                  transition: "opacity 500ms ease-out, transform 500ms ease-out",
                }}
              >
                <span
                  className={`${bodyClass} text-[10px] md:text-xs uppercase tracking-[0.5em]`}
                  style={{ color: hexWithAlpha("#2a2620", 0.55) }}
                >
                  {hisName} & {herName}
                </span>
                <div
                  className="my-3 h-px w-10"
                  style={{ backgroundColor: hexWithAlpha(accent, 0.7) }}
                />
                <p
                  className={`${displayClass} italic text-2xl md:text-4xl leading-tight`}
                  style={{ color: "#2a2620" }}
                >
                  Вас запрошено
                </p>
              </div>
            </div>

            {/* === Front X-shaped folds: 4 triangular panels meeting at center === */}

            {/* Left fold */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0% 0%, 50% 50%, 0% 100%)",
                backgroundColor: bodyTone,
                backgroundImage: `linear-gradient(90deg, ${foldHighlight} 0%, ${bodyTone} 60%, ${foldShadow} 100%)`,
                zIndex: 22,
              }}
            />
            {/* Right fold */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(100% 0%, 100% 100%, 50% 50%)",
                backgroundColor: bodyTone,
                backgroundImage: `linear-gradient(270deg, ${foldHighlight} 0%, ${bodyTone} 60%, ${foldShadow} 100%)`,
                zIndex: 22,
              }}
            />
            {/* Bottom fold (carries the names label) */}
            <div
              className="absolute inset-0 flex items-end justify-center pb-[6%]"
              style={{
                clipPath: "polygon(0% 100%, 50% 50%, 100% 100%)",
                backgroundColor: bodyTone,
                backgroundImage: `linear-gradient(180deg, ${foldShadow} 0%, ${bodyTone} 55%, ${shadeHex(bodyTone, -0.04)} 100%)`,
                zIndex: 23,
              }}
            >
              <span
                className={`${displayClass} italic`}
                style={{
                  color: namesColor,
                  fontSize: "clamp(14px, 2.6vw, 22px)",
                  letterSpacing: "0.02em",
                  textShadow: `0 1px 2px ${hexWithAlpha("#000", 0.25)}`,
                }}
              >
                {hisName} &amp; {herName}
              </span>
            </div>

            {/* X seam lines — diagonals from each corner to the center */}
            <svg
              aria-hidden
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ zIndex: 52 }}
            >
              <line x1="0" y1="0" x2="50" y2="50" stroke={seamColor} strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
              <line x1="100" y1="0" x2="50" y2="50" stroke={seamColor} strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1="100" x2="50" y2="50" stroke={seamColor} strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
              <line x1="100" y1="100" x2="50" y2="50" stroke={seamColor} strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
            </svg>

            {/* Shadow that the opening flap casts on the front + interior.
                Strongest mid-rotation when the flap is edge-on. */}
            <div
              className="absolute left-0 right-0 top-0 pointer-events-none"
              style={{
                height: "100%",
                background: `linear-gradient(180deg, ${hexWithAlpha("#000", 0.45)} 0%, ${hexWithAlpha("#000", 0)} 60%)`,
                opacity: flapShadowOpacity * 0.55 * (1 - flapProgress * 0.6),
                transition: "opacity 320ms ease-out",
                zIndex: 53,
                mixBlendMode: "multiply",
              }}
            />

            {/* Closed flap — covers top half of envelope. Hinged at the top
                edge, rotates from 0° (closed, flat) down to -90° (edge-on)
                as the envelope opens. Crossfades into the open flap so the
                silhouette never disappears. */}
            <div
              className="absolute left-0 right-0 top-0"
              style={{
                height: "50%",
                clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
                backgroundColor: flapTone,
                backgroundImage: `linear-gradient(180deg, ${flapHighlight} 0%, ${flapTone} 60%, ${flapShadow} 100%)`,
                transformOrigin: "top center",
                transform: `translateZ(6px) rotateX(${closedFlapAngle}deg)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                transition: SMOOTH,
                willChange: "transform, opacity",
                zIndex: 60,
                opacity: closedOpacity,
                filter: `brightness(${1 - flapProgress * 0.04})`,
                boxShadow: `0 6px 14px ${hexWithAlpha("#000", 0.22)}, inset 0 -1px 0 ${hexWithAlpha("#000", 0.18)}, inset 0 1px 0 ${hexWithAlpha("#fff", 0.12)}`,
              }}
            />

            {/* Open flap — upward-pointing triangle sitting above the envelope.
                Hinged at its bottom edge (= the envelope's top edge), rotates
                from +90° (edge-on, hidden) to 0° (fully upright). */}
            <div
              className="absolute left-0 right-0"
              style={{
                top: "-50%",
                height: "50%",
                clipPath: "polygon(0% 100%, 100% 100%, 50% 0%)",
                backgroundColor: flapTone,
                backgroundImage: `linear-gradient(0deg, ${flapHighlight} 0%, ${flapTone} 60%, ${flapShadow} 100%)`,
                transformOrigin: "bottom center",
                transform: `rotateX(${openFlapAngle}deg)`,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                transition: SMOOTH,
                willChange: "transform, opacity",
                zIndex: 30,
                opacity: openOpacity,
                filter: `brightness(${0.96 + flapProgress * 0.04})`,
                boxShadow: `0 -6px 14px ${hexWithAlpha("#000", 0.22)}, inset 0 1px 0 ${hexWithAlpha("#000", 0.18)}, inset 0 -1px 0 ${hexWithAlpha("#fff", 0.12)}`,
              }}
            />

            {/* Wax seal — sits at the center where the X meets.
                Fades out and drifts down as the envelope opens. */}
            <div
              className="absolute rounded-full flex items-center justify-center pointer-events-none"
              style={{
                width: "20%",
                aspectRatio: "1",
                top: "50%",
                left: "50%",
                transform: `translate3d(-50%, calc(-50% + ${sealTranslateY}%), 14px) scale(${sealScale})`,
                opacity: sealOpacity,
                transition: SMOOTH,
                willChange: "transform, opacity",
                backgroundColor: accent,
                backgroundImage: `radial-gradient(circle at 30% 30%, ${hexWithAlpha("#ffffff", 0.45)}, transparent 55%), radial-gradient(circle at 70% 80%, ${hexWithAlpha("#000000", 0.28)}, transparent 60%)`,
                border: `2px solid ${hexWithAlpha(shadeHex(accent, -0.25), 0.85)}`,
                boxShadow: `0 6px 16px ${hexWithAlpha("#000", 0.35)}, inset 0 0 0 4px ${hexWithAlpha(shadeHex(accent, 0.15), 0.6)}, inset 0 -2px 4px ${hexWithAlpha("#000", 0.25)}, inset 0 2px 4px ${hexWithAlpha("#fff", 0.25)}`,
                zIndex: 70,
              }}
            >
              <span
                className={`${displayClass} text-xl md:text-3xl leading-none`}
                style={{
                  color: sealTextColor,
                  textShadow: `0 1px 2px ${hexWithAlpha("#000", 0.4)}`,
                }}
              >
                {initialOf(hisName)}
                <span className="mx-0.5 opacity-80">&amp;</span>
                {initialOf(herName)}
              </span>
            </div>
          </div>
        </div>

        {/* hints */}
        <div
          className={`${bodyClass} relative z-10 mt-12 text-center min-h-[64px]`}
          style={{ color: text }}
        >
          <div
            className="absolute left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-3"
            style={{ opacity: hintOpacity, transition: "opacity 200ms linear" }}
          >
            <span className="text-[11px] md:text-xs uppercase tracking-[0.4em] opacity-80">
              Гортайте, щоб відкрити
            </span>
            <span
              className="block w-px h-12 animate-bounce"
              style={{ backgroundColor: accent }}
            />
          </div>
          <div
            className="absolute left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-3"
            style={{
              opacity: finalHintOpacity,
              transition: "opacity 320ms ease-out",
              animation: finalReached
                ? "envelopeFinalHintBob 1.8s ease-in-out infinite"
                : undefined,
            }}
          >
            <span className="text-[11px] md:text-xs uppercase tracking-[0.4em] opacity-80">
              Прокрутіть до запрошення
            </span>
            <span
              className="block w-px h-12"
              style={{ backgroundColor: accent }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
