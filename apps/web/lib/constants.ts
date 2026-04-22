export const TOPIC_ORDER = [
  "agents",
  "long-context",
  "multimodal",
  "interpretability",
] as const;

export type TopicSlug = (typeof TOPIC_ORDER)[number];

