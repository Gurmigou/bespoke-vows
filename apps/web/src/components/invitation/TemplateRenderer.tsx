import { useId, useMemo, type ReactNode } from "react";
import type {
  InvitationData,
  SectionBg,
  SectionConfig,
  TemplateDefinition,
  TemplateTheme,
} from "@bespoke-vows/shared";
import { getSectionComponent } from "./sections/registry";
import type { ResolvedTheme } from "./sections/types";

interface TemplateRendererProps {
  template: TemplateDefinition;
  data: InvitationData;
  /** Optional content rendered inside the scroll container before the sections. */
  prepend?: (theme: ResolvedTheme) => ReactNode;
  /** Id assigned to the first section wrapper so prepend content can scroll to it. */
  contentAnchorId?: string;
  /** Render in natural document flow (no internal 100vh scroll container). Use when nested inside another scroll context. */
  fitContent?: boolean;
}

// Multiply each RGB channel by `factor` (<1 darkens, >1 lightens).
const shadeHex = (hex: string, factor: number): string => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 0xff) * factor);
  const g = clamp(((n >> 8) & 0xff) * factor);
  const b = clamp((n & 0xff) * factor);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

const resolveBg = (bg: SectionBg | undefined, theme: TemplateTheme, primaryColor: string): string => {
  if (!bg || bg === "background") return primaryColor;
  if (bg === "background-dark") return shadeHex(primaryColor, 0.82);
  if (bg === "surface") return theme.surface;
  if (typeof bg === "object" && "color" in bg) return bg.color;
  return primaryColor;
};

const buildScopedFontStyles = (theme: TemplateTheme, scope: string, displayClass: string, bodyClass: string) => {
  const importLine = theme.fontImports.startsWith("@import")
    ? theme.fontImports
    : `@import url('${theme.fontImports}');`;

  return `
    ${importLine}
    .${scope} .${displayClass} {
      font-family: ${theme.displayFont};
      ${theme.displayFontStyle ?? ""}
    }
    .${scope} .${bodyClass} {
      font-family: ${theme.bodyFont};
      ${theme.bodyFontStyle ?? ""}
    }
  `;
};

export const TemplateRenderer = ({ template, data, prepend, contentAnchorId, fitContent }: TemplateRendererProps) => {
  const reactId = useId();
  const scope = `tpl-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const displayClass = `${scope}-display`;
  const bodyClass = `${scope}-body`;

  const theme: ResolvedTheme = useMemo(
    () => ({ ...template.theme, displayClass, bodyClass }),
    [template.theme, displayClass, bodyClass]
  );

  const styles = useMemo(
    () => buildScopedFontStyles(template.theme, scope, displayClass, bodyClass),
    [template.theme, scope, displayClass, bodyClass]
  );

  return (
    <>
      <style>{styles}</style>
      <div
        className={`${scope} ${bodyClass} ${fitContent ? "" : "h-screen overflow-y-auto"}`}
        style={{ backgroundColor: data.templateColors.primary, color: data.templateColors.text }}
      >
        {prepend?.(theme)}
        {template.sections.map((section, idx) => {
          const Component = getSectionComponent(section);
          if (!Component) return null;
          const background = resolveBg(section.bg, template.theme, data.templateColors.primary);
          const sectionData =
            section.textColor || section.accentColor
              ? {
                  ...data,
                  templateColors: {
                    ...data.templateColors,
                    text: section.textColor ?? data.templateColors.text,
                    accent: section.accentColor ?? data.templateColors.accent,
                  },
                }
              : data;
          return (
            <div key={`${section.type}-${idx}`} id={idx === 0 ? contentAnchorId : undefined}>
              <Component
                config={section as SectionConfig}
                data={sectionData}
                theme={theme}
                background={background}
              />
            </div>
          );
        })}
      </div>
    </>
  );
};
