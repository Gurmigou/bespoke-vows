import { useEffect, useMemo, useRef, useState } from "react";
import type { TemplateDefinition } from "@bespoke-vows/shared";
import { buildDefaultInvitationData } from "@bespoke-vows/shared";
import { TemplateRenderer } from "./TemplateRenderer";

/**
 * Live, miniature preview of a template's hero section — the real components
 * (including the cinematic background video) rendered at viewport size and
 * scaled to fill the card, so the card shows the actual element layout and
 * animation rather than a static mock thumbnail.
 */
export const TemplatePreviewStage = ({ template }: { template: TemplateDefinition }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ scale: 0, w: 0, h: 0, left: 0 });

  const data = useMemo(
    () => buildDefaultInvitationData(template.defaultColors),
    [template]
  );
  // Only the first (hero) section — that's the "cover" of the invitation.
  const heroOnly = useMemo<TemplateDefinition>(
    () => ({ ...template, sections: template.sections.slice(0, 1) }),
    [template]
  );

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const compute = () => {
      const cardW = el.clientWidth;
      const cardH = el.clientHeight;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (!cardH || !vh) return;
      const scale = cardH / vh; // fill card height; crop the sides
      const left = (cardW - vw * scale) / 2; // center horizontally
      setStage({ scale, w: vw, h: vh, left });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  return (
    <div ref={boxRef} className="aspect-[3/4] w-full overflow-hidden relative bg-black">
      {stage.scale > 0 && (
        <div
          className="absolute top-0 origin-top-left pointer-events-none"
          style={{
            width: stage.w,
            height: stage.h,
            left: stage.left,
            transform: `scale(${stage.scale})`,
          }}
        >
          <TemplateRenderer template={heroOnly} data={data} fitContent />
        </div>
      )}
    </div>
  );
};
