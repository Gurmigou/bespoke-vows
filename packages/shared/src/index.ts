export type TemplateId = 'classic' | 'modern' | 'floral';
export type InvitationStatus = 'draft' | 'active' | 'expired';

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

export interface Invitation {
  id: string;
  userId: string;
  templateId: TemplateId;
  status: InvitationStatus;
  paidUntil: string | null;
  data: InvitationData;
}
