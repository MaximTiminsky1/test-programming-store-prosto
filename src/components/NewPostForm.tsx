"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { createPostAction } from "@/app/posts/new/actions";
import { initialCreatePostState, type CreatePostState } from "@/lib/post-form-state";

const fieldClassName =
  "mt-1.5 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-400 aria-[invalid=true]:border-red-500";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Отправка…" : "Создать пост"}
    </button>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

export function NewPostForm() {
  const [state, formAction] = useActionState<CreatePostState, FormData>(
    createPostAction,
    initialCreatePostState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Inputs are uncontrolled, so a successful submit is the only case where the
  // form has to be cleared manually.
  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5" noValidate>
      <div>
        <label htmlFor="title" className="text-sm font-medium text-zinc-900">
          Заголовок
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={state.values?.title}
          aria-invalid={Boolean(state.fieldErrors?.title)}
          aria-describedby={state.fieldErrors?.title ? "title-error" : undefined}
          className={fieldClassName}
        />
        <FieldError id="title-error" message={state.fieldErrors?.title} />
      </div>

      <div>
        <label htmlFor="body" className="text-sm font-medium text-zinc-900">
          Текст поста
        </label>
        <textarea
          id="body"
          name="body"
          rows={6}
          defaultValue={state.values?.body}
          aria-invalid={Boolean(state.fieldErrors?.body)}
          aria-describedby={state.fieldErrors?.body ? "body-error" : undefined}
          className={`${fieldClassName} resize-y`}
        />
        <FieldError id="body-error" message={state.fieldErrors?.body} />
      </div>

      <div className="flex items-center gap-4">
        <SubmitButton />

        <div aria-live="polite" className="min-h-5">
          {state.status !== "idle" && state.message ? (
            <p
              role="status"
              className={
                state.status === "success"
                  ? "text-sm text-emerald-700"
                  : "text-sm text-red-600"
              }
            >
              {state.message}
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
