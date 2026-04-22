export default function LoadingFeedPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <div className="h-4 w-24 animate-pulse rounded bg-black/10" />
        <div className="mt-4 h-10 w-80 animate-pulse rounded bg-black/10" />
        <div className="mt-3 h-4 w-[32rem] max-w-full animate-pulse rounded bg-black/10" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/10"
          >
            <div className="h-6 w-3/4 rounded bg-black/10" />
            <div className="mt-3 h-4 w-1/2 rounded bg-black/10" />
            <div className="mt-6 flex gap-2">
              <div className="h-8 w-24 rounded-full bg-black/10" />
              <div className="h-8 w-20 rounded-full bg-black/10" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

