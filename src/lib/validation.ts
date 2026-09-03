import { z } from "zod";

export const postSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: z.string(),
  body: z.string(),
});

export const postsSchema = z.array(postSchema);

export const createPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Заголовок должен содержать минимум 3 символа")
    .max(100, "Заголовок не должен превышать 100 символов"),
  body: z
    .string()
    .trim()
    .min(10, "Текст поста должен содержать минимум 10 символов")
    .max(1000, "Текст поста не должен превышать 1000 символов"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type PostFieldErrors = Partial<Record<keyof CreatePostInput, string>>;

export function toFieldErrors(error: z.ZodError<CreatePostInput>): PostFieldErrors {
  const fieldErrors: PostFieldErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if ((field === "title" || field === "body") && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }

  return fieldErrors;
}
