import type { TemplateDefinition } from "@bespoke-vows/shared";

export const classicTemplate: TemplateDefinition = {
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
    fontFaces:
      "@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); .thumb-script-classic { font-family: \"Great Vibes\", cursive; }",
  },
  theme: {
    fontImports:
      "https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&family=Great+Vibes&display=swap",
    background: "#FBF7EE",
    surface: "#F5E6D3",
    displayFont: "\"Great Vibes\", cursive",
    displayFontStyle: "font-weight: 400;",
    bodyFont: "\"Geologica\", sans-serif",
    ornament: "hairline",
  },
  sections: [
    {
      type: "hero",
      variant: "centered",
      copy: {
        eyebrow: "Просимо честі вашої присутності",
        connector: "та",
      },
    },
    {
      type: "countdown",
      variant: "minimal",
      bg: "background",
      copy: { title: "Пригода починається" },
    },
    {
      type: "story",
      variant: "alternating",
      copy: { title: "Наша історія кохання" },
      imageAspect: "3/4",
    },
    {
      type: "colors",
      variant: "circles",
      copy: { title: "Кольори весілля" },
    },
    {
      type: "events",
      variant: "dashed",
      copy: { title: "Програма подій" },
    },
    {
      type: "venue",
      variant: "centered",
      copy: { title: "Місце проведення", closing: "Чекаємо на вас!" },
    },
  ],
};
