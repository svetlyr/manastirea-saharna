import qwikdev from "@qwikdev/astro";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    prefetch: true,
    output: "static",

    integrations: [qwikdev()],
    vite: { plugins: [tailwindcss()] },
});
