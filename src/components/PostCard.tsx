import Link from "next/link";

import type { Post } from "@/lib/types";

export function PostCard({ post }: { post: Post }) {
  return (
    <li>
      <Link
        href={`/posts/${post.id}`}
        className="-mx-3 block rounded-lg px-3 py-4 transition-colors hover:bg-zinc-50"
      >
        <div className="flex items-baseline gap-3">
          <span className="shrink-0 text-xs tabular-nums text-zinc-400">#{post.id}</span>
          <h2 className="text-[15px] font-medium leading-6 text-zinc-900 first-letter:uppercase">
            {post.title}
          </h2>
        </div>
        <p className="mt-1 line-clamp-2 pl-8 text-sm leading-6 text-zinc-500 first-letter:uppercase">
          {post.body}
        </p>
      </Link>
    </li>
  );
}
