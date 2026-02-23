type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}.${P}` : never) : never;

type FlattenedKeys<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends object ? Join<K, FlattenedKeys<T[K]>> : K;
      }[keyof T]
    : never;

export const locales = {
    ro: "ro-RO",
    en: "en-US",
    ru: "ru-RU",
} as const;

export type Locale = keyof typeof locales;

export const defaultLocale = "ro";

// TODO: rename
export const ui = {
    ro: {
        main: {
            title: "Mănăstirea Saharna",
        },
        twitter: "Twitter",
    },
    en: {
        main: {
            title: "Saharna Monastery",
        },
    },
    ru: {
        main: {
            title: "Монастырь Сахарна",
        },
    },
} as const;

export type AllTranslationKeys = FlattenedKeys<typeof ui.ro | typeof ui.en | typeof ui.ru>;
