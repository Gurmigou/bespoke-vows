import type { HeroSection as HeroSectionConfig } from "@bespoke-vows/shared";
import { BotanicalArt } from "../lib/BotanicalArt";
import type { SectionRenderProps } from "./types";

type Props = SectionRenderProps<HeroSectionConfig>;

const Centered = ({ data, theme, config, background }: Props) => {
  const text = data.templateColors.text;
  const connector = config.copy.connector ?? "та";

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center"
      style={{ backgroundColor: background, color: text }}
    >
      <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-1000">
        <div className="space-y-6">
          <h1 className={`${theme.displayClass} text-7xl md:text-8xl lg:text-9xl`} style={{ color: text }}>
            {data.herName} {connector} {data.hisName}
          </h1>
          <div className="h-px w-24 mx-auto" style={{ backgroundColor: text, opacity: 0.2 }} />
        </div>
        <div className="space-y-2">
          {config.copy.eyebrow && (
            <p
              className={`${theme.bodyClass} text-xs md:text-sm tracking-[0.3em] uppercase font-light`}
              style={{ color: text, opacity: 0.6 }}
            >
              {config.copy.eyebrow}
            </p>
          )}
          <p
            className={`${theme.bodyClass} text-base md:text-lg tracking-[0.2em] uppercase font-normal mt-6`}
            style={{ color: text }}
          >
            {data.weddingDate}
          </p>
        </div>
        <div className="pt-8">
          <p
            className={`${theme.bodyClass} text-xs md:text-sm tracking-[0.25em] uppercase font-light`}
            style={{ color: text, opacity: 0.6 }}
          >
            {data.weddingPlace}
          </p>
        </div>
      </div>
    </section>
  );
};

const Split = ({ data, theme, config, background }: Props) => {
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;
  const connector = config.copy.connector ?? "&";

  return (
    <section
      className="h-screen grid md:grid-cols-2"
      style={{ backgroundColor: background, color: text }}
    >
      <div className="flex flex-col justify-center px-8 md:px-12 py-10 space-y-6">
        {config.copy.eyebrow && (
          <div
            className={`${theme.bodyClass} text-[10px] tracking-[0.4em] uppercase font-medium`}
            style={{ color: accent }}
          >
            {config.copy.eyebrow}
          </div>
        )}
        <h1
          className={`${theme.displayClass} leading-[0.95]`}
          style={{ color: text, fontSize: "clamp(3rem, 8vw, 6rem)" }}
        >
          {data.herName}
          <br />
          <span style={{ color: accent }}>{connector}</span>
          <br />
          {data.hisName}
        </h1>
        <div className="space-y-2 pt-2">
          <div className={`${theme.bodyClass} text-xs tracking-[0.3em] uppercase opacity-70`}>{data.weddingDate}</div>
          <div className={`${theme.bodyClass} text-xs tracking-[0.3em] uppercase opacity-70`}>{data.weddingPlace}</div>
        </div>
      </div>
      <div className="hidden md:flex p-6 overflow-hidden" style={{ backgroundColor: theme.surface }}>
        <div
          className="flex-1 border flex items-center justify-center overflow-hidden"
          style={{ borderColor: `${accent}66` }}
        >
          <div
            className={`${theme.displayClass} leading-none`}
            style={{ color: `${accent}33`, fontSize: "clamp(6rem, 14vw, 10rem)", transform: "translateY(-0.05em)" }}
          >
            ∞
          </div>
        </div>
      </div>
    </section>
  );
};

const Framed = ({ data, theme, config, background }: Props) => {
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;
  const connector = config.copy.connector ?? "&";

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative"
      style={{ backgroundColor: background, color: text }}
    >
      <div className="absolute inset-6 md:inset-12 border-2 pointer-events-none" style={{ borderColor: `${accent}30` }} />
      <div className="absolute inset-8 md:inset-14 border pointer-events-none" style={{ borderColor: `${accent}20` }} />
      <div className="max-w-2xl mx-auto space-y-10 relative">
        {config.copy.eyebrow && (
          <p className={`${theme.bodyClass} italic text-sm md:text-base tracking-[0.25em] uppercase`} style={{ color: accent }}>
            {config.copy.eyebrow}
          </p>
        )}
        <h1 className={`${theme.displayClass} text-7xl md:text-8xl lg:text-[9rem] leading-[1.1]`} style={{ color: text }}>
          {data.herName}
        </h1>
        <div className={`${theme.bodyClass} italic text-3xl md:text-4xl`} style={{ color: accent }}>
          {connector}
        </div>
        <h1 className={`${theme.displayClass} text-7xl md:text-8xl lg:text-[9rem] leading-[1.1]`} style={{ color: text }}>
          {data.hisName}
        </h1>
        <p className={`${theme.bodyClass} text-base md:text-lg tracking-[0.3em] uppercase font-light`}>
          {data.weddingDate}
        </p>
        {config.copy.closing ? (
          <p className={`${theme.bodyClass} italic text-base md:text-lg`} style={{ color: accent }}>
            {config.copy.closing}
          </p>
        ) : (
          <p className={`${theme.bodyClass} italic text-base md:text-lg`} style={{ color: accent }}>
            {data.weddingPlace}
          </p>
        )}
      </div>
    </section>
  );
};

const Botanical = ({ data, theme, config, background }: Props) => {
  const text = data.templateColors.text;
  const connector = config.copy.connector ?? "та";
  const venueLabel = data.venue?.label;

  return (
    <section
      className="min-h-screen px-4 py-8 md:px-10 md:py-14"
      style={{ backgroundColor: background, color: text }}
    >
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: "62rem", minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="absolute top-0 left-0" style={{ width: "42%", height: "30%" }} aria-hidden>
          <div
            className="absolute"
            style={{ top: "10%", left: "8%", right: "0", height: "1px", backgroundColor: text }}
          />
          <div
            className="absolute"
            style={{ top: "10%", left: "8%", bottom: "0", width: "1px", backgroundColor: text }}
          />
        </div>

        <div className="absolute bottom-0 right-0" style={{ width: "46%", height: "38%" }} aria-hidden>
          <div
            className="absolute"
            style={{ bottom: "8%", left: "0", right: "10%", height: "1px", backgroundColor: text }}
          />
          <div
            className="absolute"
            style={{ bottom: "8%", right: "10%", top: "0", width: "1px", backgroundColor: text }}
          />
        </div>

        <div
          className="absolute pointer-events-none"
          style={{ top: "-1%", right: "-2%", width: "44%", maxWidth: "26rem" }}
          aria-hidden
        >
          <BotanicalArt color={text} className="w-full h-auto" />
        </div>

        <div
          className="absolute"
          style={{ top: "20%", left: "12%", right: "10%" }}
        >
          <h1
            className={`${theme.displayClass}`}
            style={{
              fontSize: "clamp(3.25rem, 11vw, 8.5rem)",
              lineHeight: 0.95,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: text,
              fontWeight: 400,
            }}
          >
            {data.herName}
          </h1>
          <div
            style={{
              fontFamily: '"Allura", "Pinyon Script", cursive',
              fontSize: "clamp(2rem, 5.5vw, 4rem)",
              color: text,
              marginLeft: "1.5rem",
              marginTop: "0.25rem",
              marginBottom: "0.25rem",
              lineHeight: 1,
            }}
          >
            {connector}
          </div>
          <h1
            className={`${theme.displayClass}`}
            style={{
              fontSize: "clamp(3.25rem, 11vw, 8.5rem)",
              lineHeight: 0.95,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: text,
              fontWeight: 400,
            }}
          >
            {data.hisName}
          </h1>
        </div>

        <div
          className={`${theme.bodyClass} absolute space-y-6`}
          style={{ bottom: "16%", left: "12%", right: "12%", color: text }}
        >
          {config.copy.eyebrow && (
            <p
              className="font-light leading-loose max-w-md"
              style={{
                fontSize: "clamp(0.7rem, 1.1vw, 0.95rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {config.copy.eyebrow}
            </p>
          )}

          <p
            className="font-normal"
            style={{
              fontSize: "clamp(0.85rem, 1.4vw, 1.15rem)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {data.weddingDate}
          </p>

          <div className="space-y-1.5">
            {venueLabel && (
              <p
                className="font-light"
                style={{
                  fontSize: "clamp(0.7rem, 1.1vw, 0.95rem)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                {venueLabel}
              </p>
            )}
            <p
              className="font-light"
              style={{
                fontSize: "clamp(0.7rem, 1.1vw, 0.95rem)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {data.weddingPlace}
            </p>
          </div>

          {config.copy.closing && (
            <div
              className="pt-4"
              style={{
                fontFamily: '"Allura", "Pinyon Script", cursive',
                fontSize: "clamp(1.4rem, 3vw, 2.25rem)",
                lineHeight: 1.1,
                color: text,
              }}
            >
              {config.copy.closing}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const HeroSection = (props: Props) => {
  switch (props.config.variant) {
    case "split":
      return <Split {...props} />;
    case "framed":
      return <Framed {...props} />;
    case "botanical":
      return <Botanical {...props} />;
    case "centered":
    default:
      return <Centered {...props} />;
  }
};
