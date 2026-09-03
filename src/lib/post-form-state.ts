import type { Post } from "./types";
import type { PostFieldErrors } from "./validation";

export type CreatePostState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: PostFieldErrors;
  values?: { title: string; body: string };
  post?: Post;
};

export const initialCreatePostState: CreatePostState = { status: "idle" };
