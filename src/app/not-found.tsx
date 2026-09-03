import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-10 text-center">
      <p className="text-sm text-zinc-400">404</p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight">Страница не найдена</h1>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        К списку постов
      </Link>
    </div>
  );
}
