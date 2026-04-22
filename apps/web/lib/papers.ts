import { createClient } from "@/lib/supabase/server";

export type FeedPaper = {
  id: string;
  title: string;
  authors: string[];
  url: string;
  published_at: string;
  paper_topics: {
    topic: {
      slug: string;
      label: string;
    } | null;
  }[];
};

export type FeedViewer = {
  userId: string | null;
  savedPaperIds: string[];
  followedTopicIds: string[];
};

type PaperRow = {
  id: string;
  title: string;
  authors: string[] | null;
  url: string;
  published_at: string;
};

type PaperTopicRow = {
  paper_id: string;
  topic_id: string;
  topic:
    | {
        slug: string;
        label: string;
      }[]
    | {
        slug: string;
        label: string;
      }
    | null;
};

export async function getFeedPapers(): Promise<FeedPaper[]> {
  return getFeedPapersForTopics();
}

export async function getFeedPapersForTopics(topicIds: string[] = []): Promise<FeedPaper[]> {
  const supabase = await createClient();
  let paperTopicsQuery = supabase
    .from("paper_topics")
    .select(
      `
        paper_id,
        topic_id,
        topic:topics (
          slug,
          label
        )
      `,
    );

  if (topicIds.length > 0) {
    paperTopicsQuery = paperTopicsQuery.in("topic_id", topicIds);
  }

  const { data: paperTopicRows, error: paperTopicsError } = await paperTopicsQuery;

  if (paperTopicsError) {
    throw new Error(`Failed to load paper topics: ${paperTopicsError.message}`);
  }

  const normalizedTopicRows = (paperTopicRows ?? []) as PaperTopicRow[];
  const paperIds = Array.from(new Set(normalizedTopicRows.map((row) => row.paper_id)));

  if (paperIds.length === 0) {
    return [];
  }

  const { data: paperRows, error: papersError } = await supabase
    .from("papers")
    .select("id, title, authors, url, published_at")
    .in("id", paperIds)
    .order("published_at", { ascending: false })
    .limit(100);

  if (papersError) {
    throw new Error(`Failed to load papers: ${papersError.message}`);
  }

  const topicsByPaperId = new Map<string, FeedPaper["paper_topics"]>();

  for (const row of normalizedTopicRows) {
    const topicValue = Array.isArray(row.topic) ? row.topic[0] ?? null : row.topic;
    const current = topicsByPaperId.get(row.paper_id) ?? [];
    current.push({ topic: topicValue });
    topicsByPaperId.set(row.paper_id, current);
  }

  return ((paperRows ?? []) as PaperRow[]).map((paper) => ({
    id: paper.id,
    title: paper.title,
    authors: paper.authors ?? [],
    url: paper.url,
    published_at: paper.published_at,
    paper_topics: topicsByPaperId.get(paper.id) ?? [],
  }));
}

export async function getFeedViewer(): Promise<FeedViewer> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      userId: null,
      savedPaperIds: [],
      followedTopicIds: [],
    };
  }

  const [{ data: saved }, { data: follows }] = await Promise.all([
    supabase.from("saved_papers").select("paper_id").eq("user_id", user.id),
    supabase.from("user_topic_follows").select("topic_id").eq("user_id", user.id),
  ]);

  return {
    userId: user.id,
    savedPaperIds: (saved ?? []).map((item) => item.paper_id),
    followedTopicIds: (follows ?? []).map((item) => item.topic_id),
  };
}
