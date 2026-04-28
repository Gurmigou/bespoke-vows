import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface BuilderSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  hue: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const BuilderSection = ({
  title,
  description,
  icon: Icon,
  hue,
  defaultOpen = true,
  children,
}: BuilderSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      className="group/section rounded-2xl overflow-hidden bg-white border border-white/70 transition-all duration-300"
      style={{
        boxShadow: isOpen
          ? `0 2px 4px ${hue}14, 0 12px 32px -14px ${hue}40`
          : `0 1px 3px ${hue}10, 0 4px 12px -8px ${hue}22`,
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className="flex items-center justify-between w-full px-5 py-4 group transition-colors hover:bg-slate-50/60 data-[state=open]:bg-slate-50/40"
          style={{
            borderBottom: isOpen ? `1px solid ${hue}1a` : "1px solid transparent",
          }}
        >
          <div className="flex items-center gap-3.5 text-left">
            <span
              className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 group-hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${hue}1a 0%, ${hue}0d 100%)`,
                color: hue,
                boxShadow: `inset 0 0 0 1px ${hue}26`,
              }}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
            </span>
            <div className="flex flex-col min-w-0">
              <h3
                className="text-[15px] font-semibold tracking-tight leading-tight"
                style={{ color: hue }}
              >
                {title}
              </h3>
              {description && (
                <p className="text-[11.5px] text-slate-500 leading-tight mt-0.5">
                  {description}
                </p>
              )}
            </div>
          </div>
          <span
            className="flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300"
            style={{
              backgroundColor: isOpen ? `${hue}14` : "transparent",
              color: hue,
            }}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </span>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
          <div className="px-5 py-6">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};

// Darker brown — anchors the builder UI to the wedding aesthetic
const SECTION_HUE = "#5C3A1E";

export const SECTION_HUES = {
  template: SECTION_HUE,
  basic: SECTION_HUE,
  venue: SECTION_HUE,
  loveStory: SECTION_HUE,
  colors: SECTION_HUE,
  events: SECTION_HUE,
} as const;
