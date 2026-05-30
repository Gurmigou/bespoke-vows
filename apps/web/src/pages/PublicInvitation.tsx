import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import type { InvitationData, Template } from "@bespoke-vows/shared";
import { TemplateRenderer } from "@/components/invitation/TemplateRenderer";
import { envelopePrepend, ENVELOPE_ANCHOR_ID } from "@/components/invitation/envelopePrepend";
import { publicApi, ApiError } from "@/lib/api";

const PublicInvitation = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<InvitationData | null>(null);
  const [template, setTemplate] = useState<Template["definition"] | null>(null);
  const [gone, setGone] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    publicApi
      .guest(id)
      .then((view) => {
        setData(view.invitation.config);
        setTemplate(view.template.definition);
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 410) setGone(true);
          else if (err.status === 404) setNotFound(true);
          else setNotFound(true);
        } else {
          setNotFound(true);
        }
      });
  }, [id]);

  if (gone || notFound) return <Navigate to="/invitation-inactive" replace />;
  if (!data || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Завантаження...</p>
      </div>
    );
  }
  return (
    <TemplateRenderer
      template={template}
      data={data}
      contentAnchorId={ENVELOPE_ANCHOR_ID}
      prepend={envelopePrepend(data)}
    />
  );
};

export default PublicInvitation;
