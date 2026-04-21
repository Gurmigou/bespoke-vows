export type TemplateId = 'classic' | 'modern' | 'floral';
export type DerivedStatus = 'draft' | 'active_free' | 'active_paid' | 'expired' | 'locked';

export interface LoveStory {
  moment1: string;
  moment2: string;
  image1Url: string;
  image2Url: string;
}

export interface WeddingEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  description?: string;
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
  loveStory: LoveStory;
  events: WeddingEvent[];
  weddingColors: string[];
  templateColors: TemplateColors;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface Invitation {
  id: string;
  userId: string;
  templateId: TemplateId;
  derivedStatus: DerivedStatus;
  publishedAt: string | null;
  lastPublishedAt: string | null;
  freeActiveDaysUsed: number;
  paidUntil: string | null;
  config: InvitationData;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationBody {
  templateId: TemplateId;
  config?: Partial<InvitationData>;
}

export interface UpdateInvitationBody {
  config: Partial<InvitationData>;
}
