import type { TemplateTheme } from "@bespoke-vows/shared";

interface OrnamentProps {
  variant: TemplateTheme["ornament"];
  color: string;
}

export const Ornament = ({ variant, color }: OrnamentProps) => {
  if (!variant || variant === "none") return null;

  if (variant === "hairline") {
    return (
      <div
        className="h-px w-24 mx-auto transition-colors duration-500"
        style={{ backgroundColor: color, opacity: 0.4 }}
      />
    );
  }

  if (variant === "flourish") {
    return (
      <div className="flex items-center justify-center gap-3 my-4" aria-hidden>
        <span className="h-px w-12" style={{ backgroundColor: color, opacity: 0.4 }} />
        <span className="text-lg" style={{ color }}>❦</span>
        <span className="h-px w-12" style={{ backgroundColor: color, opacity: 0.4 }} />
      </div>
    );
  }

  if (variant === "frame") {
    return (
      <div className="flex items-center justify-center gap-2 my-2" aria-hidden>
        <span className="text-xs tracking-[0.6em]" style={{ color, opacity: 0.6 }}>◆ ◆ ◆</span>
      </div>
    );
  }

  return null;
};
