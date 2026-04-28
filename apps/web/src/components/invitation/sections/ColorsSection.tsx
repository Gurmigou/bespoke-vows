import type { ColorsSection as ColorsConfig } from "@bespoke-vows/shared";
import { Ornament } from "../lib/Ornament";
import type { SectionRenderProps } from "./types";

type Props = SectionRenderProps<ColorsConfig>;

const Circles = ({ data, theme, config, background }: Props) => {
  if (data.weddingColors.length === 0) return null;
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;
  const ornament = config.ornament ?? theme.ornament;

  return (
    <section className="py-16 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-2xl mx-auto text-center space-y-10">
        <h2 className={`${theme.displayClass} text-5xl md:text-6xl`} style={{ color: text }}>
          {config.copy.title}
        </h2>
        {ornament && <Ornament variant={ornament} color={accent} />}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
          {data.weddingColors.map((hex, i) => (
            <div
              key={i}
              className="w-16 h-16 md:w-20 md:h-20 rounded-full transition-all duration-500 flex-shrink-0"
              style={{ backgroundColor: hex }}
              aria-label={`Колір ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Squares = ({ data, theme, config, background }: Props) => {
  if (data.weddingColors.length === 0) return null;
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;

  return (
    <section className="py-20 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-2xl mx-auto text-center space-y-10">
        {config.copy.eyebrow && (
          <div className={`${theme.bodyClass} text-[10px] tracking-[0.4em] uppercase font-medium`} style={{ color: accent }}>
            {config.copy.eyebrow}
          </div>
        )}
        <h2 className={`${theme.displayClass} text-4xl md:text-5xl`} style={{ color: text }}>
          {config.copy.title}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {data.weddingColors.map((hex, i) => (
            <div
              key={i}
              className="w-20 h-28 md:w-24 md:h-32 flex-shrink-0"
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Labelled = ({ data, theme, config, background }: Props) => {
  if (data.weddingColors.length === 0) return null;
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;
  const ornament = config.ornament ?? theme.ornament ?? "flourish";

  return (
    <section className="py-20 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <h2 className={`${theme.displayClass} text-6xl md:text-7xl`} style={{ color: text }}>
          {config.copy.title}
        </h2>
        <Ornament variant={ornament} color={accent} />
        <div className="flex flex-wrap justify-center items-end gap-4 md:gap-6">
          {data.weddingColors.map((hex, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2"
                style={{ backgroundColor: hex, borderColor: `${accent}40` }}
              />
              <span className={`${theme.bodyClass} italic text-xs`} style={{ color: accent }}>
                №{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ColorsSection = (props: Props) => {
  switch (props.config.variant) {
    case "squares":
      return <Squares {...props} />;
    case "labelled":
      return <Labelled {...props} />;
    case "circles":
    default:
      return <Circles {...props} />;
  }
};
