import { describe, expect, it } from "vitest";

import { createPostSchema, toFieldErrors } from "./validation";

const validInput = {
  title: "Заголовок поста",
  body: "Достаточно длинный текст поста для валидации.",
};

describe("createPostSchema", () => {
  it("accepts valid input", () => {
    const result = createPostSchema.safeParse(validInput);

    expect(result.success).toBe(true);
  });

  it("trims whitespace before validating and returns trimmed values", () => {
    const result = createPostSchema.safeParse({
      title: "   Заголовок поста   ",
      body: `  ${validInput.body}  `,
    });

    expect(result.success).toBe(true);
    expect(result.data?.title).toBe("Заголовок поста");
  });

  it("rejects a title made of spaces only", () => {
    const result = createPostSchema.safeParse({ ...validInput, title: "     " });

    expect(result.success).toBe(false);
  });

  it("rejects a title shorter than 3 characters", () => {
    const result = createPostSchema.safeParse({ ...validInput, title: "ab" });

    expect(result.success).toBe(false);
  });

  it("accepts boundary lengths", () => {
    const result = createPostSchema.safeParse({
      title: "a".repeat(100),
      body: "b".repeat(1000),
    });

    expect(result.success).toBe(true);
  });

  it("rejects values above the maximum length", () => {
    const result = createPostSchema.safeParse({
      title: "a".repeat(101),
      body: "b".repeat(1001),
    });

    expect(result.success).toBe(false);
  });
});

describe("toFieldErrors", () => {
  it("returns one message per invalid field", () => {
    const result = createPostSchema.safeParse({ title: "ab", body: "short" });

    expect(result.success).toBe(false);

    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error);

      expect(Object.keys(fieldErrors).sort()).toEqual(["body", "title"]);
      expect(fieldErrors.title).toContain("3");
    }
  });

  it("returns an empty object when there are no issues for known fields", () => {
    const result = createPostSchema.safeParse({ ...validInput, title: "ab" });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(toFieldErrors(result.error).body).toBeUndefined();
    }
  });
});
