import type { ReactNode } from "react";
import type { InvitationData } from "@bespoke-vows/shared";
import { EnvelopeOpening } from "./EnvelopeOpening";
import type { ResolvedTheme } from "./sections/types";

/** Id of the first invitation section the envelope scrolls to once it unmounts. */
export const ENVELOPE_ANCHOR_ID = "invitation-content";

/**
 * Builds the `prepend` for TemplateRenderer that plays the envelope-open intro.
 * Shared by the public guest view and the builder preview so they stay in sync.
 */
export const envelopePrepend =
  (data: InvitationData) =>
  (theme: ResolvedTheme): ReactNode =>
    (
      <EnvelopeOpening
        colors={data.templateColors}
        hisName={data.hisName}
        herName={data.herName}
        displayClass={theme.displayClass}
        bodyClass={theme.bodyClass}
        scrollTargetId={ENVELOPE_ANCHOR_ID}
      />
    );
