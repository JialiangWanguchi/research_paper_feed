import { XMLParser } from "fast-xml-parser";
import { env } from "./config";
import { ARXIV_TOPIC_CATALOG } from "./arxiv-topic-catalog";

export type SourcePaper = {
  sourceId: string;
  title: string;
  abstract: string;
  url: string;
  authors: string[];
  publishedAt: string;
  rawCategories: string[];
};

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPapersForQuery(query: string): Promise<SourcePaper[]> {
  const url =
    `http://export.arxiv.org/api/query?search_query=${query}` +
    `&sortBy=submittedDate&sortOrder=descending&max_results=${env.PAPER_SOURCE_MAX_RESULTS}`;

  let response = await fetch(url, {
    headers: {
      "User-Agent": env.WORKER_USER_AGENT,
    },
  });

  if (response.status === 429) {
    await sleep(4000);
    response = await fetch(url, {
      headers: {
        "User-Agent": env.WORKER_USER_AGENT,
      },
    });
  }

  if (!response.ok) {
    throw new Error(`arXiv request failed: ${response.status}`);
  }

  const xml = await response.text();
  const parsed = parser.parse(xml) as {
    feed?: { entry?: Record<string, unknown> | Array<Record<string, unknown>> };
  };

  const rawEntries = parsed.feed?.entry;
  const entries = Array.isArray(rawEntries) ? rawEntries : rawEntries ? [rawEntries] : [];

  return entries.map((entry) => {
    const authors = Array.isArray(entry.author) ? entry.author : [entry.author].filter(Boolean);
    const categories = Array.isArray(entry.category) ? entry.category : [entry.category].filter(Boolean);

    return {
      sourceId: String(entry.id).split("/abs/").pop() ?? String(entry.id),
      title: String(entry.title ?? "").replace(/\s+/g, " ").trim(),
      abstract: String(entry.summary ?? "").replace(/\s+/g, " ").trim(),
      url: String(entry.id),
      authors: authors.map((author) => String((author as { name?: string }).name ?? "")),
      publishedAt: String(entry.published),
      rawCategories: categories
        .map((category) => String((category as { term?: string }).term ?? ""))
        .filter(Boolean),
    };
  });
}

export async function fetchLatestPapers(): Promise<SourcePaper[]> {
  const bySourceId = new Map<string, SourcePaper>();

  for (const topic of ARXIV_TOPIC_CATALOG) {
    await sleep(3200);
    const papers = await fetchPapersForQuery(`cat:${topic.code}`);

    for (const paper of papers) {
      const existing = bySourceId.get(paper.sourceId);
      if (!existing) {
        bySourceId.set(paper.sourceId, paper);
        continue;
      }

      const mergedCategories = Array.from(new Set([...existing.rawCategories, ...paper.rawCategories]));
      bySourceId.set(paper.sourceId, {
        ...existing,
        rawCategories: mergedCategories,
      });
    }
  }

  return Array.from(bySourceId.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
