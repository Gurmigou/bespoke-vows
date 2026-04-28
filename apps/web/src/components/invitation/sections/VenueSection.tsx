import type { VenueSection as VenueConfig } from "@bespoke-vows/shared";
import { Ornament } from "../lib/Ornament";
import type { SectionRenderProps } from "./types";

type Props = SectionRenderProps<VenueConfig>;

const Centered = ({ data, theme, config, background }: Props) => {
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;

  return (
    <section className="py-14 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-xl mx-auto text-center space-y-12">
        <h2 className={`${theme.displayClass} text-5xl md:text-6xl`} style={{ color: text }}>
          {config.copy.title}
        </h2>
        <div className="space-y-6">
          <div className="space-y-3">
            <p className={`${theme.bodyClass} text-sm md:text-base tracking-[0.2em] uppercase font-normal`} style={{ color: text }}>
              {data.weddingPlace}
            </p>
            {data.venue?.label && (
              data.venue.mapsUrl ? (
                <a
                  href={data.venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${theme.bodyClass} text-sm md:text-base font-light underline underline-offset-4 hover:opacity-80 transition-opacity`}
                  style={{ color: accent }}
                >
                  {data.venue.label} ↗
                </a>
              ) : (
                <p className={`${theme.bodyClass} text-sm md:text-base font-light`} style={{ color: text, opacity: 0.7 }}>
                  {data.venue.label}
                </p>
              )
            )}
          </div>
          <div className="h-px w-16 mx-auto" style={{ backgroundColor: text, opacity: 0.2 }} />
          {config.copy.closing && (
            <p className={`${theme.bodyClass} text-sm md:text-base tracking-[0.2em] uppercase font-light`} style={{ color: text, opacity: 0.7 }}>
              {config.copy.closing}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

const OrnamentedVariant = ({ data, theme, config, background }: Props) => {
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;
  const ornament = config.ornament ?? theme.ornament ?? "flourish";

  return (
    <section className="py-24 px-6 text-center" style={{ backgroundColor: background }}>
      <div className="max-w-xl mx-auto space-y-6">
        <h2 className={`${theme.displayClass} text-6xl md:text-7xl`} style={{ color: text }}>
          {config.copy.title}
        </h2>
        <Ornament variant={ornament} color={accent} />
        <p className={`${theme.bodyClass} text-lg md:text-xl font-light tracking-wide`} style={{ color: text }}>
          {data.weddingPlace}
        </p>
        {config.copy.closing && (
          <p className={`${theme.bodyClass} italic text-lg md:text-xl pt-6`} style={{ color: accent }}>
            {config.copy.closing}
          </p>
        )}
      </div>
    </section>
  );
};

export const VenueSection = (props: Props) => {
  switch (props.config.variant) {
    case "ornamented":
      return <OrnamentedVariant {...props} />;
    case "centered":
    default:
      return <Centered {...props} />;
  }
};
