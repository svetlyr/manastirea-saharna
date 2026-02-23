import { isKey } from "@utils/types";
import { defaultLocale, ui } from "@i18n";
import type { AllTranslationKeys, Locale } from "@i18n";

// TODO: refactor this shit

function getNestedValue(obj: object | undefined, path: string): string | undefined {
    const keys = path.split(".");

    let current = obj;

    for (const k of keys) {
        if (current && typeof current === "object" && isKey(current, k)) {
            current = current[k];
        } else {
            return undefined;
        }
    }

    return typeof current === "string" ? current : undefined;
}

export function useTranslations(lang: Locale) {
    return (key: AllTranslationKeys): string => {
        const translation = getNestedValue(ui[lang], key);

        if (translation) {
            return translation;
        }

        const defaultTranslation = getNestedValue(ui[defaultLocale], key);

        if (defaultTranslation) {
            return defaultTranslation;
        }

        return key;
    };
}
export type UseTranslations = ReturnType<typeof useTranslations>;

export function getLocaleFromUrl(url: URL): Locale {
    const [, lang] = url.pathname.split("/");

    if (lang && lang in ui) {
        return lang as Locale;
    }

    return defaultLocale;
}
