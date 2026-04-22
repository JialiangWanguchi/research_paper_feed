import { ARXIV_TOPIC_CATALOG, codeToSlug } from "./arxiv-topic-catalog";

export type WorkerTopic = {
  id: string;
  slug: string;
};

export function buildTopicRows() {
  return ARXIV_TOPIC_CATALOG.map((topic) => ({
    slug: codeToSlug(topic.code),
    label: `${topic.label} (${topic.code})`,
    keywords: Array.from(new Set([topic.code.toLowerCase(), ...topic.keywords])),
  }));
}

export function matchTopics(rawCategories: string[], topics: WorkerTopic[]) {
  const topicIdBySlug = new Map(topics.map((topic) => [topic.slug, topic.id]));

  return rawCategories
    .map((category) => {
      const slug = codeToSlug(category);
      const topicId = topicIdBySlug.get(slug);

      if (!topicId) {
        return null;
      }

      return {
        topicId,
        matchedKeywords: [category],
      };
    })
    .filter((topic): topic is { topicId: string; matchedKeywords: string[] } => Boolean(topic));
}
