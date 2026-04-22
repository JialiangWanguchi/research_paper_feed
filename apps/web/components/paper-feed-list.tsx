import Link from "next/link";
import { SavePaperButton } from "@/components/save-paper-button";
import type { FeedPaper } from "@/lib/papers";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function PaperFeedList({
  papers,
  userId,
  savedPaperIds,
}: {
  papers: FeedPaper[];
  userId: string | null;
  savedPaperIds: string[];
}) {
  if (papers.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-black/10">
        <h2 className="text-xl font-semibold">No papers match your current topics</h2>
        <p className="mt-3 text-sm text-black/65">
          Try a different topic selection or check back after new papers are indexed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {papers.map((paper) => {
        const topics = paper.paper_topics
          .map((entry) => entry.topic)
          .filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));

        return (
          <article
            key={paper.id}
            className="rounded-[2rem] border border-black/10 bg-white/80 p-6 shadow-[0_18px_50px_rgba(25,33,43,0.08)] backdrop-blur"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-3 flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <span
                      key={`${paper.id}-${topic.slug}`}
                      className="rounded-full bg-pine/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-pine"
                    >
                      {topic.label}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold leading-snug">
                  <a href={paper.url} target="_blank" rel="noreferrer">
                    {paper.title}
                  </a>
                </h2>
                <p className="mt-2 text-sm text-black/65">
                  {paper.authors.length > 0 ? paper.authors.join(", ") : "Unknown authors"}
                </p>
                <div className="mt-3 text-sm text-black/55">{formatDate(paper.published_at)}</div>
              </div>
              <div className="shrink-0">
                {userId ? (
                  <SavePaperButton
                    paperId={paper.id}
                    userId={userId}
                    initialSaved={savedPaperIds.includes(paper.id)}
                  />
                ) : (
                  <Link
                    href="/login"
                    className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white no-underline shadow-sm"
                  >
                    Sign in to save
                  </Link>
                )}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/15 bg-[#fff7ed] px-3 py-1.5 text-sm no-underline hover:border-pine"
              >
                Open source
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}
