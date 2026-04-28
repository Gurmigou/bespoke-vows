import type { ComponentType } from "react";
import type { InvitationData } from "@/pages/Builder";
import { ClassicTemplate } from "./ClassicTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { FloralTemplate } from "./FloralTemplate";

export type TemplateId = "classic" | "modern" | "floral";

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  defaultColors: InvitationData["templateColors"];
  thumbnail: {
    bg: string;
    text: string;
    accent: string;
    swatch1: string;
    swatch2: string;
    swatch3: string;
    fontClass: string;
    headerText: string;
    fontFaces: string;
  };
}

export const TEMPLATE_REGISTRY: Record<TemplateId, ComponentType<{ data: InvitationData }>> = {
  classic: ClassicTemplate,
  modern: ModernTemplate,
  floral: FloralTemplate,
};

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "classic",
    name: "Класичний",
    description: "Витончений редакторський дизайн з рукописним шрифтом",
    defaultColors: {
      primary: "#2C2416",
      text: "#2C2416",
      accent: "#D4A574",
    },
    thumbnail: {
      bg: "#FBF7EE",
      text: "#2C2416",
      accent: "#D4A574",
      swatch1: "#F5E6D3",
      swatch2: "#D4A574",
      swatch3: "#8B7355",
      fontClass: "thumb-script-classic",
      headerText: "Софія та Михайло",
      fontFaces: `@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); .thumb-script-classic { font-family: "Great Vibes", cursive; }`,
    },
  },
  {
    id: "modern",
    name: "Модерн мінімал",
    description: "Чистий мінімалізм у рожевих відтінках",
    defaultColors: {
      primary: "#831843",
      text: "#831843",
      accent: "#EC4899",
    },
    thumbnail: {
      bg: "#FFF1F2",
      text: "#831843",
      accent: "#EC4899",
      swatch1: "#FCE7F3",
      swatch2: "#F9A8D4",
      swatch3: "#EC4899",
      fontClass: "thumb-script-modern",
      headerText: "Софія & Михайло",
      fontFaces: `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&display=swap'); .thumb-script-modern { font-family: "Cormorant Garamond", serif; font-weight: 300; letter-spacing: -0.02em; }`,
    },
  },
  {
    id: "floral",
    name: "Флораль романтик",
    description: "Романтичний вінтаж у теплих коричневих тонах",
    defaultColors: {
      primary: "#3E2723",
      text: "#3E2723",
      accent: "#8D6E63",
    },
    thumbnail: {
      bg: "#FAF6F0",
      text: "#3E2723",
      accent: "#8D6E63",
      swatch1: "#EFE4D2",
      swatch2: "#C8A98A",
      swatch3: "#8D6E63",
      fontClass: "thumb-script-floral",
      headerText: "Софія та Михайло",
      fontFaces: `@import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap'); .thumb-script-floral { font-family: "Pinyon Script", cursive; }`,
    },
  },
];

export const getTemplate = (id: string | null | undefined): TemplateId => {
  if (id && id in TEMPLATE_REGISTRY) return id as TemplateId;
  return "classic";
};
