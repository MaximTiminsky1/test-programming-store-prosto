import { afterEach, describe, expect, it, vi } from "vitest";

import { filterPosts, getPost, getPosts, PostsApiError } from "./api";
import type { Post } from "./types";

const posts: Post[] = [
  { id: 1, userId: 1, title: "Server Components", body: "Данные загружаются на сервере." },
  { id: 2, userId: 2, title: "Валидация", body: "Zod проверяет границы приложения." },
];

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("filterPosts", () => {
  it("returns every post for an empty query", () => {
    expect(filterPosts(posts, "   ")).toHaveLength(2);
  });

  it("matches title and body case-insensitively", () => {
    expect(filterPosts(posts, "ZOD")).toEqual([posts[1]]);
    expect(filterPosts(posts, "server")).toEqual([posts[0]]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterPosts(posts, "graphql")).toEqual([]);
  });
});

describe("getPosts", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("validates the payload before returning it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(posts)));

    await expect(getPosts()).resolves.toEqual(posts);
  });

  it("throws PostsApiError when the payload does not match the schema", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse([{ id: 1 }])));

    await expect(getPosts()).rejects.toBeInstanceOf(PostsApiError);
  });

  it("throws PostsApiError on a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(getPosts()).rejects.toBeInstanceOf(PostsApiError);
  });

  it("throws PostsApiError instead of SyntaxError on a malformed body", async () => {
    const response = new Response("<html>502 Bad Gateway</html>", {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));

    await expect(getPosts()).rejects.toBeInstanceOf(PostsApiError);
  });
});

describe("getPost", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns null for 404 so the page can render notFound()", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 404)));

    await expect(getPost(999)).resolves.toBeNull();
  });

  it("throws PostsApiError for other error statuses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 500)));

    await expect(getPost(1)).rejects.toBeInstanceOf(PostsApiError);
  });
});
