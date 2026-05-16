import type { CollectionConfig } from "payload";

import { triggerRebuild } from "../hooks/triggerRebuild";

const isPublishedOrAuthenticated: NonNullable<CollectionConfig["access"]>["read"] = ({ req }) => {
  if (req.user) {
    return true;
  }

  return {
    status: {
      equals: "published",
    },
  };
};

export const Posts: CollectionConfig = {
  slug: "posts",
  access: {
    read: isPublishedOrAuthenticated,
  },
  admin: {
    defaultColumns: ["title", "slug", "status", "publishedAt"],
    useAsTitle: "title",
  },
  hooks: {
    afterChange: [triggerRebuild],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      localized: true,
    },
    {
      name: "content",
      type: "textarea",
      required: true,
      localized: true,
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      required: true,
      options: [
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "Published",
          value: "published",
        },
      ],
    },
  ],
};
