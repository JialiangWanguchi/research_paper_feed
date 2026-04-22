import { redirect } from "next/navigation";
import { SavedPapers } from "@/components/saved-papers";
import { createClient } from "@/lib/supabase/server";

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("saved_papers")
    .select(
      `
        paper:papers (
          id,
          title,
          url,
          published_at
        )
      `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-accent">Saved Papers</p>
      <h1 className="mt-3 text-4xl font-semibold">Your shortlist</h1>
      <div className="mt-8">
        <SavedPapers saved={(data ?? []) as never[]} />
      </div>
    </main>
  );
}

