import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import nextEnv from "@next/env";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Media } from "./src/collections/Media";
import { Posts } from "./src/collections/Posts";
import { Users } from "./src/collections/Users";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const { loadEnvConfig } = nextEnv;

loadEnvConfig(dirname);

const hasR2Config = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_ENDPOINT &&
    process.env.R2_PUBLIC_URL,
);

const databaseUri = process.env.DATABASE_URI;

if (process.env.NODE_ENV === "production" && !process.env.PAYLOAD_SECRET) {
  throw new Error("PAYLOAD_SECRET is required in production.");
}

if (process.env.NODE_ENV === "production" && !databaseUri) {
  throw new Error("DATABASE_URI is required in production.");
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, "src/app/(payload)"),
      importMapFile: path.resolve(dirname, "src/app/(payload)/admin/importMap.js"),
    },
  },
  collections: [Users, Media, Posts],
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL,
    "http://localhost:4321",
    "http://127.0.0.1:4321",
    "https://manastirea-saharna.md",
  ].filter(Boolean) as string[],
  db: postgresAdapter({
    pool: {
      connectionString: databaseUri,
    },
  }),
  localization: {
    defaultLocale: "ro",
    fallback: true,
    locales: [
      {
        code: "ro",
        label: "Română",
      },
      {
        code: "en",
        label: "English",
      },
      {
        code: "ru",
        label: "Русский",
      },
    ],
  },
  plugins: [
    s3Storage({
      enabled: hasR2Config,
      collections: {
        media: {
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename: mediaFilename, prefix }) => {
            const key = prefix ? `${prefix}/${mediaFilename}` : mediaFilename;

            return `${process.env.R2_PUBLIC_URL}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        endpoint: process.env.R2_ENDPOINT,
        forcePathStyle: true,
        region: "auto",
      },
    }),
  ],
  secret: process.env.PAYLOAD_SECRET || "dev-only-change-me",
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
