import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface BuilderSectionProps {
  title: string;
  icon: LucideIcon;
  hue: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export const BuilderSection = ({ title, icon: Icon, hue, defaultOpen = true, children }: BuilderSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-xl overflow-hidden bg-white shadow-sm transition-all duration-500 border"
      style={{
        borderColor: `${hue}33`,
        boxShadow: `0 1px 0 ${hue}10, 0 6px 18px -10px ${hue}40`,
      }}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className="flex items-center justify-between w-full px-6 py-4 group transition-colors"
          style={{
            backgroundColor: `${hue}14`,
            borderBottom: isOpen ? `1px solid ${hue}26` : "1px solid transparent",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ backgroundColor: `${hue}22`, color: hue }}
            >
              <Icon className="w-4 h-4" />
            </span>
            <h3 className="text-base font-semibold tracking-tight" style={{ color: `${hue}` }}>
              {title}
            </h3>
          </div>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
            style={{ color: hue }}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 py-8">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
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
