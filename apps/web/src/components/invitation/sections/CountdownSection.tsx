import type { CountdownSection as CountdownConfig } from "@bespoke-vows/shared";
import countdownBg from "@/img/countdown-bg.jpg";
import { useCountdown } from "../lib/useCountdown";
import { Ornament } from "../lib/Ornament";
import type { SectionRenderProps } from "./types";

type Props = SectionRenderProps<CountdownConfig>;

const Minimal = ({ data, theme, config, background }: Props) => {
  const tl = useCountdown(data.weddingDate);
  const text = data.templateColors.text;
  const ornament = config.ornament ?? theme.ornament;

  return (
    <section
      className="relative py-16 px-6 overflow-hidden"
      style={{
        backgroundImage: `url(${countdownBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: background, opacity: 0.6 }} />
      <div className="relative max-w-2xl mx-auto text-center space-y-8">
        <h2 className={`${theme.displayClass} text-5xl md:text-6xl`} style={{ color: text }}>
          {config.copy.title}
        </h2>
        <Ornament variant={ornament} color={data.templateColors.accent} />
        <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-xl mx-auto">
          {[
            { value: tl.days, label: "Днів" },
            { value: tl.hours, label: "Годин" },
            { value: tl.minutes, label: "Хвилин" },
            { value: tl.seconds, label: "Секунд" },
          ].map((unit) => (
            <div key={unit.label} className="space-y-2">
              <div className={`${theme.bodyClass} text-3xl md:text-4xl font-light tabular-nums`} style={{ color: text }}>
                {config.padDigits ? String(unit.value).padStart(2, "0") : unit.value}
              </div>
              <div
                className={`${theme.bodyClass} text-xs tracking-[0.25em] uppercase font-medium`}
                style={{ color: text, opacity: 0.6 }}
              >
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Boxed = ({ data, theme, config, background }: Props) => {
  const tl = useCountdown(data.weddingDate);
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;

  return (
    <section className="py-20 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-3xl mx-auto text-center space-y-12">
        {config.copy.eyebrow && (
          <div className={`${theme.bodyClass} text-[10px] tracking-[0.4em] uppercase font-medium`} style={{ color: accent }}>
            {config.copy.eyebrow}
          </div>
        )}
        <h2 className={`${theme.displayClass} text-4xl md:text-5xl`} style={{ color: text }}>
          {config.copy.title}
        </h2>
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {[
            { value: tl.days, label: "Днів" },
            { value: tl.hours, label: "Годин" },
            { value: tl.minutes, label: "Хвилин" },
            { value: tl.seconds, label: "Секунд" },
          ].map((unit) => (
            <div
              key={unit.label}
              className="border p-4 md:p-6"
              style={{ borderColor: `${accent}40`, backgroundColor: theme.background }}
            >
              <div className={`${theme.bodyClass} text-3xl md:text-5xl font-light tabular-nums`} style={{ color: text }}>
                {config.padDigits ? String(unit.value).padStart(2, "0") : unit.value}
              </div>
              <div className={`${theme.bodyClass} text-[10px] tracking-[0.3em] uppercase mt-2 opacity-60`}>
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Ornamented = ({ data, theme, config, background }: Props) => {
  const tl = useCountdown(data.weddingDate);
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;
  const ornament = config.ornament ?? theme.ornament ?? "flourish";

  return (
    <section className="py-20 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {config.copy.title && (
          <h2 className={`${theme.displayClass} text-6xl md:text-7xl`} style={{ color: text }}>
            {config.copy.title}
          </h2>
        )}
        <Ornament variant={ornament} color={accent} />
        <div className="grid grid-cols-4 gap-4 md:gap-6">
          {[
            { value: tl.days, label: "Днів" },
            { value: tl.hours, label: "Годин" },
            { value: tl.minutes, label: "Хвилин" },
            { value: tl.seconds, label: "Секунд" },
          ].map((unit) => (
            <div key={unit.label} className="space-y-2">
              <div className={`${theme.bodyClass} text-4xl md:text-6xl font-light tabular-nums`} style={{ color: text }}>
                {config.padDigits ? String(unit.value).padStart(2, "0") : unit.value}
              </div>
              <div className={`${theme.bodyClass} italic text-xs md:text-sm tracking-[0.2em]`} style={{ color: accent }}>
                {unit.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CountdownSection = (props: Props) => {
  switch (props.config.variant) {
    case "boxed":
      return <Boxed {...props} />;
    case "ornamented":
      return <Ornamented {...props} />;
    case "minimal":
    default:
      return <Minimal {...props} />;
  }
};
