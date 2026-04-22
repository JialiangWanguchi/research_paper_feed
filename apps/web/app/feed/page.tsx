import { Suspense } from "react";
import { PaperFeedList } from "@/components/paper-feed-list";
import { getFeedPapersForTopics, getFeedViewer } from "@/lib/papers";

async function FeedContent() {
  const viewer = await getFeedViewer();
  if (viewer.userId && viewer.followedTopicIds.length === 0) {
    return (
      <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 text-black/70 shadow-sm">
        Choose at least one topic first. This feed only shows papers matching the topics you follow.
      </div>
    );
  }
  const papers = await getFeedPapersForTopics(viewer.followedTopicIds);
  return <PaperFeedList papers={papers} userId={viewer.userId} savedPaperIds={viewer.savedPaperIds} />;
}

export default function FeedPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Live Feed</p>
        <h1 className="mt-3 text-4xl font-semibold">Latest research papers</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-black/70">
          Papers are read from Supabase and shown newest first based on their published timestamp.
        </p>
      </div>

      <Suspense fallback={<FeedPageSkeleton />}>
        <FeedContent />
      </Suspense>
    </main>
  );
}

function FeedPageSkeleton() {
  return (
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
  );
}
