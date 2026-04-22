import { redirect } from "next/navigation";
import { TopicPicker } from "@/components/topic-picker";
import { createClient } from "@/lib/supabase/server";

export default async function TopicsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [{ data: topics }, { data: follows }] = await Promise.all([
    supabase
      .from("topics")
      .select(
        `
          id,
          slug,
          label,
          keywords,
          paper_topics!inner (
            paper_id
          )
        `,
      )
      .order("label"),
    supabase.from("user_topic_follows").select("topic_id").eq("user_id", user.id),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-accent">Personalization</p>
      <h1 className="mt-3 text-4xl font-semibold">Shape your topic list</h1>
      <p className="mt-3 max-w-2xl text-sm text-black/70">
        Search a broader default catalog, add topics to your feed, and remove them from the selected list when you do not need them.
      </p>
      <div className="mt-8">
        <TopicPicker
          topics={(topics ?? []).map(({ paper_topics, ...topic }) => topic)}
          initialFollowed={(follows ?? []).map((item) => item.topic_id)}
          userId={user.id}
        />
      </div>
    </main>
  );
}
