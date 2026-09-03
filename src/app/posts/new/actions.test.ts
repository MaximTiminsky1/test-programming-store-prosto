import { afterEach, describe, expect, it, vi } from "vitest";

import { initialCreatePostState } from "@/lib/post-form-state";

import { createPostAction } from "./actions";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

function formDataOf(title: string, body: string): FormData {
  const formData = new FormData();
  formData.set("title", title);
  formData.set("body", body);
  return formData;
}

const validPost = {
  id: 101,
  userId: 1,
  title: "Валидный заголовок",
  body: "Достаточно длинный текст поста для валидации.",
};

function jsonResponse(payload: unknown, status = 201): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("createPostAction", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("returns field errors and never calls the API for invalid input", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const state = await createPostAction(initialCreatePostState, formDataOf("ab", "короткий"));

    expect(state.status).toBe("error");
    expect(state.fieldErrors).toEqual({
      title: "Заголовок должен содержать минимум 3 символа",
      body: "Текст поста должен содержать минимум 10 символов",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends trimmed values and userId to the API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(validPost));
    vi.stubGlobal("fetch", fetchMock);

    const state = await createPostAction(
      initialCreatePostState,
      formDataOf(`  ${validPost.title}  `, `  ${validPost.body}  `),
    );

    expect(state.status).toBe("success");
    expect(state.post).toEqual(validPost);

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toEqual({
      title: validPost.title,
      body: validPost.body,
      userId: 1,
    });
  });

  it("keeps the submitted values when the API returns an error status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 500)));

    const state = await createPostAction(
      initialCreatePostState,
      formDataOf(validPost.title, validPost.body),
    );

    expect(state.status).toBe("error");
    expect(state.message).toContain("500");
    expect(state.values).toEqual({ title: validPost.title, body: validPost.body });
  });

  it("reports a controlled error when the API is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const state = await createPostAction(
      initialCreatePostState,
      formDataOf(validPost.title, validPost.body),
    );

    expect(state.status).toBe("error");
    expect(state.message).toContain("недоступен");
  });

  it("rejects a response that does not match the post schema", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ id: "101" })));

    const state = await createPostAction(
      initialCreatePostState,
      formDataOf(validPost.title, validPost.body),
    );

    expect(state.status).toBe("error");
    expect(state.message).toContain("неожиданном формате");
  });
});
