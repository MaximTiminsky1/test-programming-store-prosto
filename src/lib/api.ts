import type { Post } from "./types";
import { type CreatePostInput, postSchema, postsSchema } from "./validation";

const API_BASE_URL = process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com";

const LIST_REVALIDATE_SECONDS = 60;

export class PostsApiError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "PostsApiError";
  }
}

async function request(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetch(`${API_BASE_URL}${path}`, init);
  } catch (cause) {
    throw new PostsApiError("Сервис постов недоступен", { cause });
  }
}

/**
 * response.json() throws a SyntaxError on a malformed body, which would escape as
 * an unrelated error type; every failure of this module is a PostsApiError.
 */
async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (cause) {
    throw new PostsApiError("Сервис постов вернул невалидный JSON", { cause });
  }
}

export async function getPosts(): Promise<Post[]> {
  const response = await request("/posts", {
    headers: { Accept: "application/json" },
    next: { revalidate: LIST_REVALIDATE_SECONDS, tags: ["posts"] },
  });

  if (!response.ok) {
    throw new PostsApiError(`Не удалось загрузить список постов (HTTP ${response.status})`);
  }

  const parsed = postsSchema.safeParse(await readJson(response));

  if (!parsed.success) {
    throw new PostsApiError("Сервис постов вернул данные в неожиданном формате");
  }

  return parsed.data;
}

export async function getPost(id: number): Promise<Post | null> {
  const response = await request(`/posts/${id}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: LIST_REVALIDATE_SECONDS },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new PostsApiError(`Не удалось загрузить пост #${id} (HTTP ${response.status})`);
  }

  const parsed = postSchema.safeParse(await readJson(response));

  if (!parsed.success) {
    throw new PostsApiError("Сервис постов вернул данные в неожиданном формате");
  }

  return parsed.data;
}

export async function createPost(input: CreatePostInput): Promise<Post> {
  const response = await request("/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ ...input, userId: 1 }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new PostsApiError(`Сервис постов вернул ошибку ${response.status}`);
  }

  const parsed = postSchema.safeParse(await readJson(response));

  if (!parsed.success) {
    throw new PostsApiError("Сервис постов вернул данные в неожиданном формате");
  }

  return parsed.data;
}

export function filterPosts(posts: Post[], query: string): Post[] {
  const normalized = query.trim().toLocaleLowerCase();

  if (!normalized) {
    return posts;
  }

  return posts.filter((post) =>
    `${post.title} ${post.body}`.toLocaleLowerCase().includes(normalized),
  );
}
