import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getPost } from "@/lib/api";

function parseId(rawId: string): number | null {
  const id = Number(rawId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[id]">): Promise<Metadata> {
  const { id } = await params;
  const parsedId = parseId(id);

  if (parsedId === null) {
    return { title: "Пост не найден" };
  }

  const post = await getPost(parsedId);

  return { title: post ? post.title : "Пост не найден" };
}

export default async function PostPage({ params }: PageProps<"/posts/[id]">) {
  const { id } = await params;
  const parsedId = parseId(id);

  if (parsedId === null) {
    notFound();
  }

  const post = await getPost(parsedId);

  if (!post) {
    notFound();
  }

  return (
    <article>
      <Link href="/" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
        ← К списку
      </Link>

      <h1 className="mt-6 text-2xl font-semibold leading-8 tracking-tight first-letter:uppercase">
        {post.title}
      </h1>
      <p className="mt-2 text-xs text-zinc-400">
        Пост #{post.id} · автор {post.userId}
      </p>

      <p className="mt-6 whitespace-pre-line leading-7 text-zinc-700 first-letter:uppercase">
        {post.body}
      </p>
    </article>
  );
}
