import type { EventsSection as EventsConfig } from "@bespoke-vows/shared";
import { Ornament } from "../lib/Ornament";
import type { SectionRenderProps } from "./types";

type Props = SectionRenderProps<EventsConfig>;

const Dashed = ({ data, theme, config, background }: Props) => {
  if (data.events.length === 0) return null;
  const text = data.templateColors.text;

  return (
    <section className="py-14 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-xl mx-auto">
        <h2 className={`${theme.displayClass} text-5xl md:text-6xl text-center mb-16`} style={{ color: text }}>
          {config.copy.title}
        </h2>
        <div className="space-y-8">
          {data.events.map((event, i) => (
            <div
              key={event.id}
              className="pb-6 animate-in fade-in duration-700"
              style={{
                animationDelay: `${i * 100}ms`,
                borderBottom: `1px solid ${text}20`,
              }}
            >
              <div className="flex items-baseline justify-between">
                <span className={`${theme.bodyClass} text-sm md:text-base tracking-[0.2em] uppercase font-medium`} style={{ color: text }}>
                  {event.time}
                </span>
                <span className={`${theme.bodyClass} text-sm md:text-base tracking-[0.25em] uppercase font-light`} style={{ color: text }}>
                  {event.eventName}
                </span>
              </div>
              {event.comment && (
                <p className={`${theme.bodyClass} text-sm italic mt-2 text-left`} style={{ color: text, opacity: 0.6 }}>
                  {event.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Numbered = ({ data, theme, config, background }: Props) => {
  if (data.events.length === 0) return null;
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;

  return (
    <section className="py-20 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          {config.copy.eyebrow && (
            <div className={`${theme.bodyClass} text-[10px] tracking-[0.4em] uppercase font-medium`} style={{ color: accent }}>
              {config.copy.eyebrow}
            </div>
          )}
          <h2 className={`${theme.displayClass} text-4xl md:text-5xl`} style={{ color: text }}>
            {config.copy.title}
          </h2>
        </div>
        <div className="space-y-0">
          {data.events.map((event, i) => (
            <div key={event.id} className="py-5 border-b" style={{ borderColor: `${text}15` }}>
              <div className="grid grid-cols-[auto_1fr_auto] gap-6 items-baseline">
                <span className={`${theme.bodyClass} text-[10px] tracking-[0.3em] opacity-50 tabular-nums`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`${theme.bodyClass} text-sm md:text-base font-light tracking-wide`}>
                  {event.eventName}
                </span>
                <span className={`${theme.bodyClass} text-sm md:text-base tabular-nums font-medium`} style={{ color: accent }}>
                  {event.time}
                </span>
              </div>
              {event.comment && (
                <p className={`${theme.bodyClass} text-sm italic mt-2 ml-10 opacity-60 text-left`}>
                  {event.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DottedLine = ({ data, theme, config, background }: Props) => {
  if (data.events.length === 0) return null;
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;
  const ornament = config.ornament ?? theme.ornament ?? "flourish";

  return (
    <section className="py-24 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`${theme.displayClass} text-6xl md:text-7xl`} style={{ color: text }}>
            {config.copy.title}
          </h2>
          <Ornament variant={ornament} color={accent} />
        </div>
        <div className="space-y-2">
          {data.events.map((event) => (
            <div key={event.id} className="py-4 border-b" style={{ borderColor: `${accent}25` }}>
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-baseline">
                <span className={`${theme.bodyClass} italic text-lg md:text-xl`} style={{ color: accent }}>
                  {event.time}
                </span>
                <span className="h-px w-full mt-3" style={{ backgroundColor: `${accent}30` }} />
                <span className={`${theme.bodyClass} text-lg md:text-xl font-light`} style={{ color: text }}>
                  {event.eventName}
                </span>
              </div>
              {event.comment && (
                <p className={`${theme.bodyClass} italic text-base mt-2 text-left`} style={{ color: accent, opacity: 0.7 }}>
                  {event.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const EventsSection = (props: Props) => {
  switch (props.config.variant) {
    case "numbered":
      return <Numbered {...props} />;
    case "dotted-line":
      return <DottedLine {...props} />;
    case "dashed":
    default:
      return <Dashed {...props} />;
  }
};
