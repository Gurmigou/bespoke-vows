export type DerivedStatus = 'draft' | 'active_free' | 'active_paid' | 'expired' | 'locked';

export interface LoveStoryMoment {
  id: string;
  title: string;
  description: string;
  image: string;
  imagePosition: { x: number; y: number };
}

export interface LoveStory {
  moments: LoveStoryMoment[];
}

export interface WeddingEvent {
  id: string;
  time: string;
  eventName: string;
  comment?: string;
}

export interface Venue {
  label: string;
  mapsUrl: string;
}

export interface TemplateColors {
  primary: string;
  text: string;
  accent: string;
}

export interface InvitationData {
  hisName: string;
  herName: string;
  weddingDate: string;
  weddingPlace: string;
  venue: Venue;
  loveStory: LoveStory;
  events: WeddingEvent[];
  weddingColors: string[];
  templateColors: TemplateColors;
}

// ----------------------------------------------------------------------------
// Template definition (JSON-serialisable; consumed by the renderer)
// ----------------------------------------------------------------------------

export interface TemplateThumbnail {
  bg: string;
  text: string;
  accent: string;
  swatch1: string;
  swatch2: string;
  swatch3: string;
  fontClass: string;
  headerText: string;
  fontFaces: string;
}

export interface TemplateTheme {
  /** Google Fonts import URL or full @import block. */
  fontImports: string;
  /** Page-wide background colour. */
  background: string;
  /** Secondary/alternating section background. */
  surface: string;
  /** Display font family (used for headings). */
  displayFont: string;
  /** Optional weight/style suffix appended to the display font CSS. */
  displayFontStyle?: string;
  /** Body/sans font family. */
  bodyFont: string;
  /** Additional letter-spacing/style applied to body font. */
  bodyFontStyle?: string;
  /** Optional decorative motif rendered between sections. */
  ornament?: 'none' | 'hairline' | 'flourish' | 'frame';
}

/** Where a section pulls its background from. */
export type SectionBg = 'background' | 'surface' | { color: string } | { image: string };

export interface SectionBase {
  bg?: SectionBg;
  /** Decorative motif to render at the top of the section. Falls back to theme.ornament. */
  ornament?: TemplateTheme['ornament'];
  /** Override the resolved text color for this section (e.g. light text on a dark bg). */
  textColor?: string;
  /** Override the resolved accent color for this section. */
  accentColor?: string;
}

// ---- Hero ------------------------------------------------------------------
export interface HeroSection extends SectionBase {
  type: 'hero';
  /** centered: stacked text. split: text + decorative panel. framed: bordered box. botanical: minimal botanical line-art with corner brackets. */
  variant: 'centered' | 'split' | 'framed' | 'botanical';
  copy: {
    /** "Save the date" / "Просимо честі вашої присутності" */
    eyebrow?: string;
    /** Optional connector glyph between names (e.g. "&", "та"). Defaults to "та". */
    connector?: string;
    /** Closing tagline shown beneath the date. */
    closing?: string;
  };
}

// ---- Countdown -------------------------------------------------------------
export interface CountdownSection extends SectionBase {
  type: 'countdown';
  /** minimal: bare numbers. boxed: numbers in cells. ornament: framed by motif. */
  variant: 'minimal' | 'boxed' | 'ornamented';
  copy: {
    title: string;
    eyebrow?: string;
  };
  /** Pad single-digit numbers with a leading zero. */
  padDigits?: boolean;
}

// ---- Love Story ------------------------------------------------------------
export interface StorySection extends SectionBase {
  type: 'story';
  /** alternating: photos flip sides. stacked: photo on left, text on right. framed: bordered photos. */
  variant: 'alternating' | 'stacked' | 'framed';
  copy: {
    title: string;
    eyebrow?: string;
  };
  /** CSS filter applied to story photos (e.g. 'grayscale(1)'). */
  imageFilter?: string;
  /** Photo aspect ratio (e.g. '3/4', '4/5'). */
  imageAspect?: string;
}

// ---- Colours ---------------------------------------------------------------
export interface ColorsSection extends SectionBase {
  type: 'colors';
  /** circles: round swatches. squares: rectangles. labelled: circles with index labels. */
  variant: 'circles' | 'squares' | 'labelled';
  copy: {
    title: string;
    eyebrow?: string;
  };
}

// ---- Events ----------------------------------------------------------------
export interface EventsSection extends SectionBase {
  type: 'events';
  /** dashed: time + name on a single line. numbered: indexed list. dotted-line: time-line-name. */
  variant: 'dashed' | 'numbered' | 'dotted-line';
  copy: {
    title: string;
    eyebrow?: string;
  };
}

// ---- Venue -----------------------------------------------------------------
export interface VenueSection extends SectionBase {
  type: 'venue';
  variant: 'centered' | 'ornamented';
  copy: {
    title: string;
    eyebrow?: string;
    closing?: string;
  };
}

export type SectionConfig =
  | HeroSection
  | CountdownSection
  | StorySection
  | ColorsSection
  | EventsSection
  | VenueSection;

export type SectionType = SectionConfig['type'];

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  defaultColors: TemplateColors;
  thumbnail: TemplateThumbnail;
  theme: TemplateTheme;
  sections: SectionConfig[];
}

// ----------------------------------------------------------------------------
// API contracts
// ----------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Invitation {
  id: string;
  userId: string;
  templateId: string;
  derivedStatus: DerivedStatus;
  publishedAt: string | null;
  lastPublishedAt: string | null;
  freeActiveDaysUsed: number;
  paidUntil: string | null;
  config: InvitationData;
  hidden: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationBody {
  templateId: string;
  config?: Partial<InvitationData>;
}

export interface UpdateInvitationBody {
  config: Partial<InvitationData>;
}
