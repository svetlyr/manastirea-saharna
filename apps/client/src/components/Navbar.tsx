import { component$, Slot } from "@builder.io/qwik";

import type { Locale } from "@i18n";
import { useTranslations } from "@i18n/utils";

type NavbarProps = {
    path: string;
    lang: Locale;
};

const Navbar = component$<NavbarProps>(({ path, lang }) => {
    const t = useTranslations(lang);

    return (
        <header class="px-global flex bg-white">
            <Slot name="logo" /> <p>{t("main.title")}</p>
        </header>
    );
});

export default Navbar;
