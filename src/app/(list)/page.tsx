import { PostCard } from "@/components/PostCard";
import { SearchForm } from "@/components/SearchForm";
import { filterPosts, getPosts } from "@/lib/api";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const { q } = await searchParams;
  const query = Array.isArray(q) ? (q[0] ?? "") : (q ?? "");

  const posts = await getPosts();
  const visiblePosts = filterPosts(posts, query);

  return (
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Все посты</h1>

      <div className="mt-6">
        <SearchForm query={query} />
      </div>

      <p className="mt-4 text-xs text-zinc-400" aria-live="polite">
        {query ? `Найдено: ${visiblePosts.length} из ${posts.length}` : `Всего: ${posts.length}`}
      </p>

      {visiblePosts.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center">
          <p className="text-sm font-medium text-zinc-900">Ничего не найдено</p>
          <p className="mt-1 text-sm text-zinc-500">
            Попробуйте изменить запрос или сбросить поиск.
          </p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-zinc-100" aria-label="Список постов">
          {visiblePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </ul>
      )}
    </div>
  );
}
