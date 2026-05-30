import type { InvitationData } from "@bespoke-vows/shared";
import { TemplateRenderer } from "./TemplateRenderer";
import { getTemplateDefinition } from "./templates/registry";

interface InvitationPreviewProps {
  data: InvitationData;
  templateId: string;
  /** Render in natural document flow (no internal 100vh scroll). Use when nested inside another scroll context. */
  fitContent?: boolean;
}

export const InvitationPreview = ({ data, templateId, fitContent }: InvitationPreviewProps) => {
  const template = getTemplateDefinition(templateId);
  return <TemplateRenderer template={template} data={data} fitContent={fitContent} />;
};
