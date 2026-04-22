"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SavePaperButton } from "@/components/save-paper-button";

type FeedPaper = {
  id: string;
  title: string;
  abstract: string;
  url: string;
  authors: string[];
  published_at: string;
  paper_topics: { topic: { slug: string; label: string } | null }[];
};

type FeedQueryRow = {
  id: string;
  title: string;
  abstract: string;
  url: string;
  authors: string[] | null;
  published_at: string;
  paper_topics: {
    topic:
      | {
          slug: string;
          label: string;
        }[]
      | null;
  }[];
};

function normalizePaper(row: FeedQueryRow): FeedPaper {
  return {
    id: row.id,
    title: row.title,
    abstract: row.abstract,
    url: row.url,
    authors: row.authors ?? [],
    published_at: row.published_at,
    paper_topics: row.paper_topics.map((entry) => ({
      topic: entry.topic?.[0] ?? null,
    })),
  };
}

type FeedProps = {
  initialPapers: FeedPaper[];
  followedTopicIds: string[];
  savedPaperIds: string[];
  userId: string;
};

export function Feed({ initialPapers, followedTopicIds, savedPaperIds, userId }: FeedProps) {
  const supabase = useMemo(() => createClient(), []);
  const [papers, setPapers] = useState(initialPapers);

  useEffect(() => {
    async function reload() {
      const { data, error } = await supabase
        .from("papers")
        .select(
          `
            id,
            title,
            abstract,
            url,
            authors,
            published_at,
            paper_topics!inner (
              topic:topics (
                slug,
                label
              )
            )
          `,
        )
        .in("paper_topics.topic_id", followedTopicIds)
        .order("published_at", { ascending: false })
        .limit(25);

      if (!error && data) {
        setPapers((data as FeedQueryRow[]).map(normalizePaper));
      }
    }

    const channel = supabase
      .channel("paper-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "papers" }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "paper_topics" }, reload)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [followedTopicIds, supabase]);

  if (followedTopicIds.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-6 ring-1 ring-black/10">
        Follow at least one topic to see a personalized live feed.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {papers.map((paper) => (
        <article key={paper.id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/10">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-accent">
                {paper.paper_topics.map((entry) =>
                  entry.topic ? <span key={`${paper.id}-${entry.topic.slug}`}>{entry.topic.label}</span> : null,
                )}
              </div>
              <h2 className="mt-3 text-xl font-semibold">
                <a href={paper.url} target="_blank" rel="noreferrer">
                  {paper.title}
                </a>
              </h2>
              <p className="mt-2 text-sm text-black/65">{paper.authors.join(", ")}</p>
            </div>
            <SavePaperButton
              paperId={paper.id}
              userId={userId}
              initialSaved={savedPaperIds.includes(paper.id)}
            />
          </div>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-black/80">{paper.abstract}</p>
        </article>
      ))}
    </div>
  );
}
