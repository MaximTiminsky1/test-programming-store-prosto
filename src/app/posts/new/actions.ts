"use server";

import { revalidatePath } from "next/cache";

import { createPost, PostsApiError } from "@/lib/api";
import type { CreatePostState } from "@/lib/post-form-state";
import { createPostSchema, toFieldErrors } from "@/lib/validation";

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const values = {
    title: String(formData.get("title") ?? ""),
    body: String(formData.get("body") ?? ""),
  };

  const parsed = createPostSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  try {
    const post = await createPost(parsed.data);

    revalidatePath("/");

    return { status: "success", message: `Пост создан (id: ${post.id})`, post };
  } catch (error) {
    console.error("createPostAction failed", error);

    return {
      status: "error",
      message:
        error instanceof PostsApiError
          ? `${error.message}. Попробуйте ещё раз.`
          : "Не удалось создать пост. Попробуйте ещё раз.",
      values: parsed.data,
    };
  }
}
