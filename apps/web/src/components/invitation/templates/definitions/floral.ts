import type { TemplateDefinition } from "@bespoke-vows/shared";

export const floralTemplate: TemplateDefinition = {
  id: "floral",
  name: "Ботанічний мінімал",
  description: "Витончений мінімалізм із ботанічною графікою на кремовому тлі",
  defaultColors: {
    primary: "#F4EFE6",
    text: "#1A1A1A",
    accent: "#8C7355",
  },
  thumbnail: {
    bg: "#F4EFE6",
    text: "#1A1A1A",
    accent: "#1A1A1A",
    swatch1: "#F4EFE6",
    swatch2: "#D9D2C2",
    swatch3: "#1A1A1A",
    fontClass: "thumb-script-floral",
    headerText: "Софія & Михайло",
    fontFaces:
      "@import url('https://fonts.googleapis.com/css2?family=Allura&family=Italiana&display=swap'); .thumb-script-floral { font-family: \"Italiana\", serif; letter-spacing: 0.06em; }",
  },
  theme: {
    fontImports:
      "https://fonts.googleapis.com/css2?family=Allura&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Italiana&display=swap",
    background: "#F4EFE6",
    surface: "#EDE6D6",
    displayFont: "\"Italiana\", serif",
    displayFontStyle: "font-weight: 400; letter-spacing: 0.04em;",
    bodyFont: "\"Cormorant Garamond\", serif",
    bodyFontStyle: "letter-spacing: 0.02em;",
    ornament: "hairline",
  },
  sections: [
    {
      type: "hero",
      variant: "botanical",
      copy: {
        eyebrow:
          "Із радістю запрошуємо розділити з нами день, коли ми сказали одне одному «так»",
        connector: "та",
      },
    },
    {
      type: "countdown",
      variant: "ornamented",
      bg: "surface",
      copy: { title: "" },
    },
    {
      type: "story",
      variant: "framed",
      bg: "background",
      copy: { title: "Наша історія кохання" },
      ornament: "none",
      imageFilter: "grayscale(0.15)",
      imageAspect: "4/5",
    },
    {
      type: "colors",
      variant: "labelled",
      bg: "surface",
      copy: { title: "Палітра" },
    },
    {
      type: "events",
      variant: "dotted-line",
      bg: "background",
      ornament: "none",
      copy: { title: "Програма дня" },
    },
    {
      type: "venue",
      variant: "ornamented",
      bg: "surface",
      copy: {
        title: "Місце проведення",
        closing: "З нетерпінням чекаємо на вас",
      },
    },
  ],
};
