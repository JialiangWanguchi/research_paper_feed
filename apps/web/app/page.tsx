import Link from "next/link";
import { PaperFeedList } from "@/components/paper-feed-list";
import { getFeedPapersForTopics } from "@/lib/papers";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2.5rem] border border-black/10 bg-white/75 p-10 shadow-[0_30px_80px_rgba(255,179,71,0.18)] backdrop-blur">
            <p className="text-sm uppercase tracking-[0.24em] text-accent">Fresh papers, fast</p>
            <h1 className="mt-4 text-5xl font-semibold leading-[1.05] md:text-6xl">
              Follow research in real time without living inside arXiv tabs.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">
              Track new papers, save the ones worth revisiting, and shape the stream around the
              topics you actually care about.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/feed"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-white no-underline shadow-lg shadow-black/10"
              >
                Browse the feed
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium text-ink no-underline"
              >
                Sign in to personalize
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[2rem] bg-[#fff2cc] p-7 ring-1 ring-black/10">
              <p className="text-xs uppercase tracking-[0.22em] text-black/55">What it does</p>
              <h2 className="mt-3 text-2xl font-semibold">One stream for agents, multimodal, interpretability, and more.</h2>
              <p className="mt-3 text-sm leading-6 text-black/70">
                The worker keeps polling, Supabase stores the catalog, and the UI stays readable.
              </p>
            </div>
            <div className="rounded-[2rem] bg-[#dff3ff] p-7 ring-1 ring-black/10">
              <p className="text-xs uppercase tracking-[0.22em] text-black/55">Why it feels better</p>
              <p className="mt-3 text-sm leading-6 text-black/70">
                Search topics, create your own keywords, then keep only the papers you want to save.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const [{ data: follows }, { data: saved }] = await Promise.all([
    supabase.from("user_topic_follows").select("topic_id").eq("user_id", user.id),
    supabase.from("saved_papers").select("paper_id").eq("user_id", user.id),
  ]);

  const followedTopicIds = (follows ?? []).map((item) => item.topic_id);
  const savedPaperIds = (saved ?? []).map((item) => item.paper_id);
  const papers = await getFeedPapersForTopics(followedTopicIds);

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">Live feed</p>
          <h1 className="mt-2 text-4xl font-semibold">Your research stream</h1>
        </div>
        <Link
          href="/topics"
          className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm no-underline shadow-sm"
        >
          Edit topics
        </Link>
      </div>
      {followedTopicIds.length === 0 ? (
        <div className="rounded-[2rem] border border-black/10 bg-white/80 p-8 text-black/70 shadow-sm">
          Choose at least one topic first. Your homepage feed only shows papers matching the topics
          you follow.
        </div>
      ) : (
        <PaperFeedList papers={papers} userId={user.id} savedPaperIds={savedPaperIds} />
      )}
    </main>
  );
}
