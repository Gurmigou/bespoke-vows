import type { ComponentType } from "react";
import type { InvitationData, SectionConfig, TemplateTheme } from "@bespoke-vows/shared";

export interface ResolvedTheme extends TemplateTheme {
  /** Scoped CSS class on the renderer root that applies the display font. */
  displayClass: string;
  /** Scoped CSS class on the renderer root that applies the body font. */
  bodyClass: string;
}

export interface SectionRenderProps<C extends SectionConfig = SectionConfig> {
  data: InvitationData;
  theme: ResolvedTheme;
  config: C;
  /** Background colour resolved from `config.bg` and theme. */
  background: string;
}

export type SectionComponent<C extends SectionConfig = SectionConfig> = ComponentType<
  SectionRenderProps<C>
>;
