export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Загрузка постов">
      <div className="h-7 w-32 animate-pulse rounded bg-zinc-100" />
      <div className="mt-6 h-10 animate-pulse rounded-lg bg-zinc-100" />
      <div className="mt-8 space-y-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
            <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
