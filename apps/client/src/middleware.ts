import { defineMiddleware } from "astro:middleware";

import { getLocaleFromUrl } from "@i18n/utils";

export const onRequest = defineMiddleware((context, next) => {
    context.locals.lang = getLocaleFromUrl(context.url);

    return next();
});
