import { fetchLatestPapers } from "./arxiv";
import { env } from "./config";
import { supabase } from "./supabase";
import { buildTopicRows, matchTopics } from "./topics";

async function syncOnce() {
  const topicRows = buildTopicRows();
  const { error: topicsUpsertError } = await supabase.from("topics").upsert(topicRows, {
    onConflict: "slug",
  });

  if (topicsUpsertError) {
    throw topicsUpsertError;
  }

  const { data: topics, error: topicsError } = await supabase
    .from("topics")
    .select("id, slug, label, keywords");
  if (topicsError) {
    throw topicsError;
  }
  const papers = await fetchLatestPapers();

  for (const paper of papers) {
    const { data: insertedPaper, error: paperError } = await supabase
      .from("papers")
      .upsert(
        {
          source: "arxiv",
          source_id: paper.sourceId,
          title: paper.title,
          abstract: paper.abstract,
          url: paper.url,
          authors: paper.authors,
          published_at: paper.publishedAt,
          raw_categories: paper.rawCategories,
        },
        { onConflict: "source,source_id" },
      )
      .select("id")
      .single();

    if (paperError || !insertedPaper) {
      throw paperError ?? new Error(`Failed to upsert paper ${paper.sourceId}`);
    }

    const matchedTopics = matchTopics(
      paper.rawCategories,
      (topics ?? []).map((topic) => ({
        id: topic.id,
        slug: topic.slug,
      })),
    );

    for (const topic of matchedTopics) {
      const { error: relationError } = await supabase.from("paper_topics").upsert({
        paper_id: insertedPaper.id,
        topic_id: topic.topicId,
        matched_keywords: topic.matchedKeywords,
      });

      if (relationError) {
        throw relationError;
      }
    }
  }

  console.log(
    `[worker] synced ${papers.length} papers and prepared ${topicRows.length} arXiv topics at ${new Date().toISOString()}`,
  );
}

async function main() {
  await syncOnce();
  setInterval(() => {
    syncOnce().catch((error) => {
      console.error("[worker] sync failed", error);
    });
  }, env.WORKER_POLL_INTERVAL_MS);
}

main().catch((error) => {
  console.error("[worker] fatal error", error);
  process.exit(1);
});
