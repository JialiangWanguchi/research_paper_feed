"use client";

type SavedPaper = {
  paper: {
    id: string;
    title: string;
    url: string;
    published_at: string;
  } | null;
};

export function SavedPapers({ saved }: { saved: SavedPaper[] }) {
  if (saved.length === 0) {
    return <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">No saved papers yet.</div>;
  }

  return (
    <div className="space-y-4">
      {saved.map((entry) =>
        entry.paper ? (
          <article key={entry.paper.id} className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
            <h2 className="text-lg font-semibold">
              <a href={entry.paper.url} target="_blank" rel="noreferrer">
                {entry.paper.title}
              </a>
            </h2>
            <p className="mt-2 text-sm text-black/65">{new Date(entry.paper.published_at).toLocaleString()}</p>
          </article>
        ) : null,
      )}
    </div>
  );
}

