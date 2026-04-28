import type { SectionConfig, SectionType } from "@bespoke-vows/shared";
import { HeroSection } from "./HeroSection";
import { CountdownSection } from "./CountdownSection";
import { StorySection } from "./StorySection";
import { ColorsSection } from "./ColorsSection";
import { EventsSection } from "./EventsSection";
import { VenueSection } from "./VenueSection";
import type { SectionComponent } from "./types";

// Each section component narrows on `config.type` internally; the registry
// stores them under a unified loose signature so the renderer can dispatch by
// `type` without a giant switch statement.
export const SECTION_REGISTRY: Record<SectionType, SectionComponent> = {
  hero: HeroSection as SectionComponent,
  countdown: CountdownSection as SectionComponent,
  story: StorySection as SectionComponent,
  colors: ColorsSection as SectionComponent,
  events: EventsSection as SectionComponent,
  venue: VenueSection as SectionComponent,
};

export const getSectionComponent = (config: SectionConfig): SectionComponent =>
  SECTION_REGISTRY[config.type];
