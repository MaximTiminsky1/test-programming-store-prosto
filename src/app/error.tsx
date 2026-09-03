"use client";

/**
 * In production Next.js replaces server-side error messages with a generic one and
 * exposes only `digest`, so showing `error.message` here would print framework
 * boilerplate to the user. The message is stable, the digest helps match the case
 * against server logs.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6">
      <h1 className="text-sm font-semibold text-red-900">Не удалось загрузить данные</h1>
      <p className="mt-1 text-sm text-red-700">
        Сервис постов сейчас недоступен или ответил неожиданным образом.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500"
      >
        Попробовать снова
      </button>
      {error.digest ? (
        <p className="mt-4 text-xs text-red-400">Код ошибки: {error.digest}</p>
      ) : null}
    </div>
  );
}
