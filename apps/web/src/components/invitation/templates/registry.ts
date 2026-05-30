import type { TemplateDefinition, TemplateThumbnail, TemplateColors } from "@bespoke-vows/shared";
import { classicTemplate } from "./definitions/classic";
import { modernTemplate } from "./definitions/modern";
import { floralTemplate } from "./definitions/floral";
import { royalTemplate } from "./definitions/royal";

/**
 * Adding a new template:
 *  1. Create a `TemplateDefinition` JSON object under `./definitions/`.
 *  2. Add it to the `TEMPLATES` array below.
 *
 * No section components need to be touched as long as the new template uses
 * existing section types + variants. To add a brand-new layout, register a new
 * section type in `../sections/registry.ts` first, then reference it here.
 */
// Усі шаблони лишаються в коді, але показуємо лише королівський.
const ALL_TEMPLATES: TemplateDefinition[] = [classicTemplate, modernTemplate, floralTemplate, royalTemplate];

export const TEMPLATES: TemplateDefinition[] = [royalTemplate];

const TEMPLATE_BY_ID: Record<string, TemplateDefinition> = ALL_TEMPLATES.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {}
);

export type TemplateId = string;

/**
 * Backward-compatible type alias matching the old shape some callers used.
 * Prefer importing `TemplateDefinition` directly from `@bespoke-vows/shared`.
 */
export interface TemplateMeta {
  id: string;
  name: string;
  description: string;
  defaultColors: TemplateColors;
  thumbnail: TemplateThumbnail;
}

export const getTemplateDefinition = (id: string | null | undefined): TemplateDefinition =>
  (id && TEMPLATE_BY_ID[id]) || TEMPLATES[0];

export const getTemplateId = (id: string | null | undefined): string =>
  id && id in TEMPLATE_BY_ID ? id : TEMPLATES[0].id;

/** Legacy alias preserved so existing imports keep working. */
export const getTemplate = getTemplateId;
