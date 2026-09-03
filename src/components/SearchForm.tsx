import Link from "next/link";

export function SearchForm({ query }: { query: string }) {
  return (
    <form action="/" method="get" role="search" className="flex flex-col gap-2 sm:flex-row">
      <label htmlFor="post-search" className="sr-only">
        Поиск по постам
      </label>
      <input
        id="post-search"
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Поиск по заголовку и тексту"
        className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm placeholder:text-zinc-400"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Найти
      </button>
      {query ? (
        <Link
          href="/"
          className="rounded-lg px-3 py-2 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
        >
          Сбросить
        </Link>
      ) : null}
    </form>
  );
}
