import { locales, type Locale } from "@i18n";

export const POSTS_PER_PAGE = 3;

type PayloadMedia = {
  alt?: string;
  filename?: string;
  url?: string;
};

type PayloadPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  mainImage?: PayloadMedia | string;
  publishedAt?: string;
};

type PayloadListResponse<T> = {
  docs: T[];
  totalPages: number;
};

export type PostItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
  image: {
    alt: string;
    url: string;
  } | null;
};

export const payloadApiUrl = (import.meta.env.PAYLOAD_API_URL || "http://localhost:3001").replace(/\/$/, "");
const postsCache = new Map<Locale, Promise<PostItem[]>>();
const postsWarningLog = new Set<Locale>();

function getImage(media: PayloadPost["mainImage"]) {
  if (!media || typeof media === "string" || !media.url) {
    return null;
  }

  const url = media.url.startsWith("http") ? media.url : `${payloadApiUrl}${media.url}`;

  return {
    alt: media.alt || "",
    url,
  };
}

function formatDate(value: string | undefined, locale: Locale) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(locales[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function toPostItem(post: PayloadPost, locale: Locale): PostItem {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    date: formatDate(post.publishedAt, locale),
    excerpt: post.excerpt || "",
    body: post.content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean),
    image: getImage(post.mainImage),
  };
}

async function fetchPostsFromPayload(locale: Locale) {
  const limit = "100";
  const docs: PayloadPost[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const params = new URLSearchParams({
      depth: "1",
      limit,
      locale,
      page: String(currentPage),
      sort: "-publishedAt",
    });
    params.set("where[status][equals]", "published");

    const response = await fetch(`${payloadApiUrl}/api/posts?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch posts from Payload: ${response.status} ${response.statusText}`);
    }

    const payloadResponse = (await response.json()) as PayloadListResponse<PayloadPost>;
    docs.push(...payloadResponse.docs);
    totalPages = payloadResponse.totalPages;
    currentPage += 1;
  } while (currentPage <= totalPages);

  return docs.map((post) => toPostItem(post, locale));
}

export async function getPublishedPosts(locale: Locale) {
  if (import.meta.env.DEV) {
    return fetchPostsFromPayload(locale).catch((error: unknown) => {
      console.warn(`Failed to load posts for locale "${locale}". Rendering without posts.`, error);

      return [];
    });
  }

  const cached = postsCache.get(locale);

  if (cached) {
    return cached;
  }

  const request = fetchPostsFromPayload(locale).catch((error: unknown) => {
    postsCache.delete(locale);

    if (!postsWarningLog.has(locale)) {
      postsWarningLog.add(locale);
      console.warn(`Failed to load posts for locale "${locale}". Rendering without posts.`, error);
    }

    return [];
  });

  postsCache.set(locale, request);

  return request;
}

export async function getRecentPosts(locale: Locale, limit = 3) {
  const posts = await getPublishedPosts(locale);

  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string | undefined, locale: Locale) {
  if (!slug) {
    return undefined;
  }

  const posts = await getPublishedPosts(locale);

  return posts.find((post) => post.slug === slug);
}

export async function getAllPostSlugs() {
  const posts = await getPublishedPosts("ro");

  return posts.map((post) => post.slug);
}

export function getPaginatedPosts(posts: PostItem[], page: number) {
  const start = (page - 1) * POSTS_PER_PAGE;

  return posts.slice(start, start + POSTS_PER_PAGE);
}

export function getTotalPostPages(totalPosts: number) {
  return Math.max(1, Math.ceil(totalPosts / POSTS_PER_PAGE));
}
