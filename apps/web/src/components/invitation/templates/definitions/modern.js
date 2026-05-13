export const modernTemplate = {
    id: "modern",
    name: "Модерн мінімал",
    description: "Чистий мінімалізм у зелених відтінках",
    defaultColors: {
        primary: "#1F3A2E",
        text: "#1F3A2E",
        accent: "#4F7B5F",
    },
    thumbnail: {
        bg: "#F4F7F1",
        text: "#1F3A2E",
        accent: "#4F7B5F",
        swatch1: "#E8EFE4",
        swatch2: "#A7BFA3",
        swatch3: "#4F7B5F",
        fontClass: "thumb-script-modern",
        headerText: "Софія & Михайло",
        fontFaces: "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300&display=swap'); .thumb-script-modern { font-family: \"Cormorant Garamond\", serif; font-weight: 300; letter-spacing: -0.02em; }",
    },
    theme: {
        fontImports: "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Cormorant+Garamond:wght@300;400;500&display=swap",
        background: "#F4F7F1",
        surface: "#E8EFE4",
        displayFont: "\"Cormorant Garamond\", serif",
        displayFontStyle: "font-weight: 300; letter-spacing: -0.02em;",
        bodyFont: "\"Inter\", sans-serif",
        ornament: "none",
    },
    sections: [
        {
            type: "hero",
            variant: "split",
            copy: {
                connector: "&",
            },
        },
        {
            type: "countdown",
            variant: "ornamented",
            bg: { color: "#1F3A2E" },
            textColor: "#F4F7F1",
            accentColor: "#A7BFA3",
            padDigits: true,
            copy: {
                title: "Наше весілля вже через",
            },
        },
        {
            type: "story",
            variant: "stacked",
            bg: "background",
            copy: {
                title: "Наша історія",
            },
            imageFilter: "grayscale(1)",
        },
        {
            type: "colors",
            variant: "squares",
            bg: { color: "#1F3A2E" },
            textColor: "#F4F7F1",
            accentColor: "#A7BFA3",
            copy: {
                title: "Кольори",
            },
        },
        {
            type: "events",
            variant: "numbered",
            bg: "background",
            copy: {
                title: "Програма",
            },
        },
        {
            type: "venue",
            variant: "centered",
            bg: "surface",
            copy: {
                title: "Місце проведення",
                closing: "Чекаємо на вас",
            },
        },
    ],
};
