// ============================================================================
// Domain enums
// ============================================================================

export type DerivedStatus = 'draft' | 'active' | 'expired';
export type InvitationStatus = 'draft' | 'active';
export type PaymentStatus = 'free' | 'paid';
export type PaymentRecordStatus = 'succeeded' | 'pending' | 'failed';
export type PaymentKind = 'invitation_1y' | 'lifetime';

// ============================================================================
// Pricing
// ============================================================================

export const PRICE_INVITATION_1Y_CENTS = 1599;
export const PRICE_LIFETIME_CENTS = 3999;
export const PRICE_INVITATION_1Y_USD = 15.99;
export const PRICE_LIFETIME_USD = 39.99;
export const PRICING_CURRENCY = 'USD';

// ============================================================================
// Invitation user-filled data (stored in invitations.config jsonb)
// ============================================================================

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

// ============================================================================
// Template definition (stored in templates.definition jsonb)
// ============================================================================

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
  fontImports: string;
  background: string;
  surface: string;
  displayFont: string;
  displayFontStyle?: string;
  bodyFont: string;
  bodyFontStyle?: string;
  ornament?: 'none' | 'hairline' | 'flourish' | 'frame';
}

export type SectionBg = 'background' | 'surface' | { color: string } | { image: string };

export interface SectionBase {
  bg?: SectionBg;
  ornament?: TemplateTheme['ornament'];
  textColor?: string;
  accentColor?: string;
}

export interface HeroSection extends SectionBase {
  type: 'hero';
  variant: 'centered' | 'split' | 'framed' | 'botanical';
  copy: {
    eyebrow?: string;
    connector?: string;
    closing?: string;
  };
}

export interface CountdownSection extends SectionBase {
  type: 'countdown';
  variant: 'minimal' | 'boxed' | 'ornamented';
  copy: { title: string; eyebrow?: string };
  padDigits?: boolean;
}

export interface StorySection extends SectionBase {
  type: 'story';
  variant: 'alternating' | 'stacked' | 'framed';
  copy: { title: string; eyebrow?: string };
  imageFilter?: string;
  imageAspect?: string;
}

export interface ColorsSection extends SectionBase {
  type: 'colors';
  variant: 'circles' | 'squares' | 'labelled';
  copy: { title: string; eyebrow?: string };
}

export interface EventsSection extends SectionBase {
  type: 'events';
  variant: 'dashed' | 'numbered' | 'dotted-line';
  copy: { title: string; eyebrow?: string };
}

export interface VenueSection extends SectionBase {
  type: 'venue';
  variant: 'centered' | 'ornamented';
  copy: { title: string; eyebrow?: string; closing?: string };
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

// ============================================================================
// API DTOs (what the frontend receives — server strips internal columns)
// ============================================================================

export type SubscriptionStatus = 'none' | 'pro';

export interface User {
  id: string;
  email: string;
  subscriptionStatus: SubscriptionStatus;
  subscriptionEndDate: string | null;
  createdAt: string;
}

export interface Template {
  id: string;
  slug: string;
  name: string;
  description: string;
  definition: TemplateDefinition;
  defaultData: InvitationData;
}

export interface Invitation {
  id: string;
  userId: string;
  templateId: string;
  templateSlug: string;
  status: InvitationStatus;
  paymentStatus: PaymentStatus;
  derivedStatus: DerivedStatus;
  activeUntil: string | null;
  visible: boolean;
  visibleStatusChangedAt: string | null;
  paymentId: string | null;
  freeTrialUsedAt: string | null;
  config: InvitationData;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invitationId: string | null;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  kind: PaymentKind;
  createdAt: string;
  // Joined fields (read-only, computed by server)
  couple: string;
  templateSlug: string;
  activeUntil: string | null;
}

// ============================================================================
// API request bodies
// ============================================================================

export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  token: string;
  password: string;
}

export interface CreateInvitationBody {
  templateId: string;
  config?: Partial<InvitationData>;
}

export interface UpdateInvitationBody {
  config: Partial<InvitationData>;
}

export interface HideInvitationBody {
  visible: boolean;
}

export interface PreviewTokenResponse {
  token: string;
}

export interface PublicInvitationView {
  template: Template;
  invitation: Pick<Invitation, 'id' | 'config' | 'activeUntil'>;
}

// ============================================================================
// Default invitation data (used for reset and new invitation previews)
// ============================================================================

export function buildDefaultInvitationData(templateColors: TemplateColors): InvitationData {
  return {
    hisName: 'Михайло',
    herName: 'Софія',
    weddingDate: '15 червня 2025',
    weddingPlace: 'Ресторан Маяк, Київ, Україна',
    venue: {
      label: 'Ресторан Маяк, вул. Набережна 1, Київ',
      mapsUrl: '',
    },
    loveStory: {
      moments: [
        {
          id: 'm-1',
          title: 'Як ми зустрілися',
          description:
            'Ми зустрілися ранньої осені 2020 року на студентській вечірці у Львові. Те, що розпочалося як випадкова розмова про улюблені книги, непомітно перетворилося на кілька годин сміху і відвертих одкровень — і ми обидва відчули, що щось особливе щойно народилося.',
          image: '',
          imagePosition: { x: 50, y: 50 },
        },
        {
          id: 'm-2',
          title: 'Пропозиція',
          description:
            'Через три роки, у тому ж затишному кафе на Ринковій площі, де ми провели наше перше побачення, Михайло опустився на коліно. Навколо зупинився час, і серед теплого осіннього світла Софія сказала «так».',
          image: '',
          imagePosition: { x: 50, y: 50 },
        },
      ],
    },
    events: [
      { id: '1', time: '16:00', eventName: 'Церемонія' },
      { id: '2', time: '17:00', eventName: 'Коктейль' },
      { id: '3', time: '18:30', eventName: 'Прийом' },
      { id: '4', time: '19:00', eventName: 'Вечеря' },
      { id: '5', time: '21:00', eventName: 'Танці' },
    ],
    weddingColors: ['#2E4D3A', '#6B8F71', '#A7BFA3', '#E8DCC4'],
    templateColors: { ...templateColors },
  };
}
