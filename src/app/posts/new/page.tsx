import type { Metadata } from "next";
import Link from "next/link";

import { NewPostForm } from "@/components/NewPostForm";

export const metadata: Metadata = {
  title: "Новый пост",
};

export default function NewPostPage() {
  return (
    <div>
      <Link href="/" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
        ← К списку
      </Link>

      <h1 className="mt-6 text-xl font-semibold tracking-tight">Новый пост</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Поля проверяются Zod-схемой внутри Server Action.
      </p>

      <div className="mt-8">
        <NewPostForm />
      </div>

      <p className="mt-10 border-t border-zinc-200 pt-4 text-xs leading-5 text-zinc-400">
        JSONPlaceholder имитирует создание: сервер возвращает id 101, но пост не сохраняется,
        поэтому в списке он не появится.
      </p>
    </div>
  );
}
