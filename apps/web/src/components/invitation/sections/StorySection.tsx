import type { StorySection as StoryConfig, InvitationData } from "@bespoke-vows/shared";
import storyPhoto1 from "@/img/story-photo-1.jpg";
import storyPhoto2 from "@/img/story-photo-2.jpg";
import { Ornament } from "../lib/Ornament";
import type { SectionRenderProps } from "./types";

type Props = SectionRenderProps<StoryConfig>;

interface ResolvedMoment {
  image: string;
  title: string;
  text: string;
  position: { x: number; y: number };
  reverse: boolean;
}

const FALLBACK_PHOTOS = [storyPhoto1, storyPhoto2];

const resolveMoments = (data: InvitationData): ResolvedMoment[] =>
  data.loveStory.moments
    .map((m, i) => ({
      image: m.image || FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length],
      title: m.title,
      text: m.description,
      position: m.imagePosition ?? { x: 50, y: 50 },
      reverse: i % 2 === 1,
    }))
    .filter((m) => m.text?.trim() || m.title?.trim());

const Alternating = ({ data, theme, config, background }: Props) => {
  const moments = resolveMoments(data);
  if (moments.length === 0) return null;
  const text = data.templateColors.text;
  const aspect = config.imageAspect ?? "3/4";

  return (
    <section className="py-16 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-5xl mx-auto space-y-12">
        <h2
          className={`${theme.displayClass} text-5xl md:text-6xl text-center`}
          style={{ color: text }}
        >
          {config.copy.title}
        </h2>
        <div className="space-y-16 md:space-y-20">
          {moments.map((m, i) => (
            <div key={i} className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center`}>
              <div className={m.reverse ? "md:order-2" : ""}>
                <img
                  src={m.image}
                  alt={m.title || `Момент ${i + 1}`}
                  className={`w-full h-auto object-cover`}
                  style={{
                    aspectRatio: aspect,
                    objectPosition: `${m.position.x}% ${m.position.y}%`,
                    filter: config.imageFilter,
                  }}
                />
              </div>
              <div className={`flex flex-col justify-center gap-4 ${m.reverse ? "md:order-1" : ""}`}>
                {m.title && (
                  <h3 className={`${theme.displayClass} text-3xl md:text-4xl`} style={{ color: text }}>
                    {m.title}
                  </h3>
                )}
                {m.text && (
                  <p
                    className={`${theme.bodyClass} text-xs tracking-[0.2em] uppercase font-light leading-relaxed text-justify`}
                    style={{ color: text, opacity: 0.6 }}
                  >
                    {m.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Stacked = ({ data, theme, config, background }: Props) => {
  const moments = resolveMoments(data);
  if (moments.length === 0) return null;
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;

  return (
    <section className="py-20 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-3xl mx-auto space-y-16">
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
        <div className="space-y-12">
          {moments.map((m, idx) => (
            <div key={idx} className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={m.image}
                    alt={`Момент ${idx + 1}`}
                    className="w-full h-full object-cover transition-all duration-700"
                    style={{
                      objectPosition: `${m.position.x}% ${m.position.y}%`,
                      filter: config.imageFilter ?? "grayscale(1)",
                    }}
                  />
                </div>
              </div>
              <div className="md:col-span-3 space-y-3">
                <div className={`${theme.bodyClass} text-[10px] tracking-[0.4em] uppercase font-medium`} style={{ color: accent }}>
                  {String(idx + 1).padStart(2, "0")}
                </div>
                {m.title && (
                  <h3 className={`${theme.displayClass} text-2xl md:text-3xl`} style={{ color: text }}>
                    {m.title}
                  </h3>
                )}
                {m.text && (
                  <p className={`${theme.bodyClass} text-base md:text-lg font-light leading-relaxed`} style={{ color: text }}>
                    {m.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Framed = ({ data, theme, config, background }: Props) => {
  const moments = resolveMoments(data);
  if (moments.length === 0) return null;
  const text = data.templateColors.text;
  const accent = data.templateColors.accent;
  const ornament = config.ornament ?? theme.ornament ?? "flourish";
  const aspect = config.imageAspect ?? "4/5";

  return (
    <section className="py-24 px-6" style={{ backgroundColor: background }}>
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center">
          <h2 className={`${theme.displayClass} text-6xl md:text-7xl`} style={{ color: text }}>
            {config.copy.title}
          </h2>
          <Ornament variant={ornament} color={accent} />
        </div>
        <div className="space-y-20">
          {moments.map((m, idx) => (
            <div key={idx} className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className={m.reverse ? "md:order-2" : ""}>
                <div className="relative">
                  <div className="absolute -inset-3 border" style={{ borderColor: `${accent}40` }} />
                  <img
                    src={m.image}
                    alt={`Момент ${idx + 1}`}
                    className="relative w-full object-cover"
                    style={{
                      aspectRatio: aspect,
                      objectPosition: `${m.position.x}% ${m.position.y}%`,
                      filter: config.imageFilter ?? "sepia(0.2)",
                    }}
                  />
                </div>
              </div>
              <div className={`space-y-4 ${m.reverse ? "md:order-1" : ""}`}>
                <div className={`${theme.displayClass} text-5xl`} style={{ color: accent }}>
                  {m.title || `Розділ ${idx + 1}`}
                </div>
                {m.text && (
                  <p className={`${theme.bodyClass} text-base md:text-lg leading-relaxed font-light`} style={{ color: text }}>
                    {m.text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const StorySection = (props: Props) => {
  switch (props.config.variant) {
    case "stacked":
      return <Stacked {...props} />;
    case "framed":
      return <Framed {...props} />;
    case "alternating":
    default:
      return <Alternating {...props} />;
  }
};
