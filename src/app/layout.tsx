import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Посты",
    template: "%s — Посты",
  },
  description: "Тестовое приложение на Next.js App Router: список постов и форма создания",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-zinc-900">
        <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
            <Link href="/" className="text-sm font-semibold tracking-tight">
              Посты
            </Link>
            <Link
              href="/posts/new"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              Новый пост
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">{children}</main>

        <footer className="border-t border-zinc-200">
          <div className="mx-auto max-w-2xl px-4 py-6 text-xs text-zinc-400">
            Данные: JSONPlaceholder
          </div>
        </footer>
      </body>
    </html>
  );
}
