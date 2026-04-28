import type { InvitationData } from "@/pages/Builder";
import { TEMPLATE_REGISTRY, type TemplateId } from "./templates/registry";

interface InvitationPreviewProps {
  data: InvitationData;
  templateId: TemplateId;
}

export const InvitationPreview = ({ data, templateId }: InvitationPreviewProps) => {
  const Template = TEMPLATE_REGISTRY[templateId] ?? TEMPLATE_REGISTRY.classic;
  return <Template data={data} />;
};
