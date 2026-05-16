import type { CollectionAfterChangeHook } from "payload";

type DispatchBody = {
  event_type: string;
  client_payload: {
    collection: string;
    slug?: string;
    status?: string;
  };
};

export const triggerRebuild: CollectionAfterChangeHook = async ({ doc, collection }) => {
  if (doc.status !== "published") {
    return doc;
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const eventType = process.env.GITHUB_EVENT_TYPE;

  if (!token || !owner || !repo || !eventType) {
    return doc;
  }

  const body: DispatchBody = {
    event_type: eventType,
    client_payload: {
      collection: collection.slug,
      slug: typeof doc.slug === "string" ? doc.slug : undefined,
      status: typeof doc.status === "string" ? doc.status : undefined,
    },
  };

  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.warn(`GitHub repository_dispatch failed: ${response.status} ${response.statusText}`);
  }

  return doc;
};
