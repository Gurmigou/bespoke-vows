import { useId, useMemo } from "react";
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
}

const resolveBg = (bg: SectionBg | undefined, theme: TemplateTheme): string => {
  if (!bg || bg === "background") return theme.background;
  if (bg === "surface") return theme.surface;
  if (typeof bg === "object" && "color" in bg) return bg.color;
  return theme.background;
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

export const TemplateRenderer = ({ template, data }: TemplateRendererProps) => {
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
        className={`${scope} ${bodyClass} h-screen overflow-y-auto`}
        style={{ backgroundColor: template.theme.background, color: data.templateColors.text }}
      >
        {template.sections.map((section, idx) => {
          const Component = getSectionComponent(section);
          if (!Component) return null;
          const background = resolveBg(section.bg, template.theme);
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
            <Component
              key={`${section.type}-${idx}`}
              config={section as SectionConfig}
              data={sectionData}
              theme={theme}
              background={background}
            />
          );
        })}
      </div>
    </>
  );
};
