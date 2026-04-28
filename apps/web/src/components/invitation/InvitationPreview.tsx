import type { InvitationData } from "@bespoke-vows/shared";
import { TemplateRenderer } from "./TemplateRenderer";
import { getTemplateDefinition } from "./templates/registry";

interface InvitationPreviewProps {
  data: InvitationData;
  templateId: string;
}

export const InvitationPreview = ({ data, templateId }: InvitationPreviewProps) => {
  const template = getTemplateDefinition(templateId);
  return <TemplateRenderer template={template} data={data} />;
};
