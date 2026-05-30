import type { TemplateDefinition } from "@bespoke-vows/shared";

export const royalTemplate: TemplateDefinition = {
  id: "royal",
  name: "Королівський",
  description:
    "Розкішний королівський стиль із кінематографічним відео, рукописним шрифтом та золотими акцентами",
  defaultColors: {
    primary: "#2A1220",
    text: "#F3E6CC",
    accent: "#C9A24B",
  },
  thumbnail: {
    bg: "#2A1220",
    text: "#F3E6CC",
    accent: "#C9A24B",
    swatch1: "#C9A24B",
    swatch2: "#7A2A3C",
    swatch3: "#F3E6CC",
    fontClass: "thumb-script-royal",
    headerText: "Софія та Михайло",
    fontFaces:
      "@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap'); .thumb-script-royal { font-family: \"Great Vibes\", cursive; }",
  },
  theme: {
    fontImports:
      "https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&family=Great+Vibes&display=swap",
    background: "#2A1220",
    surface: "#7A2A3C",
    displayFont: "\"Great Vibes\", cursive",
    displayFontStyle: "font-weight: 400;",
    bodyFont: "\"Geologica\", sans-serif",
    bodyFontStyle: "letter-spacing: 0.08em;",
    ornament: "flourish",
  },
  sections: [
    {
      type: "hero",
      variant: "cinematic",
      media: { video: "/royal-hero.mp4", overlay: 0.55 },
      copy: {
        eyebrow: "Запрошуємо вас розділити з нами найважливіший день",
        connector: "&",
      },
    },
    {
      type: "countdown",
      variant: "ornamented",
      bg: "background",
      padDigits: true,
      copy: { title: "До нашого свята залишилось" },
    },
    {
      type: "story",
      variant: "framed",
      bg: "background",
      copy: { title: "Наша історія кохання" },
      imageAspect: "4/5",
      imageFilter: "sepia(0.15)",
    },
    {
      type: "colors",
      variant: "labelled",
      bg: "background-dark",
      copy: { title: "Палітра свята" },
    },
    {
      type: "events",
      variant: "dotted-line",
      bg: "background",
      copy: { title: "Програма урочистості" },
    },
    {
      type: "venue",
      variant: "ornamented",
      bg: "background-dark",
      copy: {
        title: "Місце проведення",
        closing: "З нетерпінням чекаємо на вас",
      },
    },
  ],
};
