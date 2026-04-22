export type DefaultTopic = {
  slug: string;
  label: string;
  keywords: string[];
};

export const DEFAULT_TOPICS: DefaultTopic[] = [
  { slug: "agents", label: "Agents", keywords: ["agent", "agents", "tool use", "autonomous agent"] },
  { slug: "llms", label: "LLMs", keywords: ["llm", "llms", "large language model", "foundation model"] },
  { slug: "prompting", label: "Prompting", keywords: ["prompt", "prompting", "in-context learning"] },
  { slug: "rag", label: "RAG", keywords: ["rag", "retrieval augmented generation", "retrieval"] },
  { slug: "long-context", label: "Long Context", keywords: ["long context", "context window", "long-range"] },
  { slug: "multimodal", label: "Multimodal", keywords: ["multimodal", "vision-language", "image-text"] },
  { slug: "computer-vision", label: "Computer Vision", keywords: ["vision", "image segmentation", "detection"] },
  { slug: "nlp", label: "Natural Language Processing", keywords: ["nlp", "summarization", "translation"] },
  { slug: "speech-audio", label: "Speech and Audio", keywords: ["speech", "audio", "asr", "speaker"] },
  { slug: "robotics", label: "Robotics", keywords: ["robot", "robotics", "manipulation", "embodied"] },
  { slug: "reinforcement-learning", label: "Reinforcement Learning", keywords: ["reinforcement learning", "rl", "bandit"] },
  { slug: "reasoning", label: "Reasoning", keywords: ["reasoning", "chain of thought", "deliberation"] },
  { slug: "alignment", label: "Alignment", keywords: ["alignment", "reward modeling", "rlhf"] },
  { slug: "safety", label: "AI Safety", keywords: ["safety", "harmlessness", "red teaming"] },
  { slug: "interpretability", label: "Interpretability", keywords: ["interpretability", "mechanistic", "probing"] },
  { slug: "evaluation", label: "Evaluation", keywords: ["evaluation", "benchmark", "leaderboard"] },
  { slug: "information-retrieval", label: "Information Retrieval", keywords: ["information retrieval", "search", "ranking"] },
  { slug: "knowledge-graphs", label: "Knowledge Graphs", keywords: ["knowledge graph", "entity linking", "relation extraction"] },
  { slug: "graphs-gnn", label: "Graphs and GNNs", keywords: ["graph neural network", "gnn", "graph learning"] },
  { slug: "recommender-systems", label: "Recommender Systems", keywords: ["recommendation", "recommender system", "ranking"] },
  { slug: "time-series", label: "Time Series", keywords: ["time series", "forecasting", "temporal"] },
  { slug: "anomaly-detection", label: "Anomaly Detection", keywords: ["anomaly detection", "outlier detection"] },
  { slug: "privacy-security", label: "Privacy and Security", keywords: ["privacy", "security", "adversarial"] },
  { slug: "optimization", label: "Optimization", keywords: ["optimization", "convex", "solver"] },
  { slug: "systems", label: "ML Systems", keywords: ["systems", "serving", "latency", "throughput"] },
  { slug: "databases", label: "Databases", keywords: ["database", "query optimization", "data management"] },
  { slug: "distributed-systems", label: "Distributed Systems", keywords: ["distributed system", "cluster", "parallel"] },
  { slug: "human-computer-interaction", label: "HCI", keywords: ["hci", "user study", "interface"] },
  { slug: "healthcare-ai", label: "Healthcare AI", keywords: ["medical", "clinical", "healthcare"] },
  { slug: "finance-econ-ml", label: "Finance and Econ ML", keywords: ["finance", "economic", "trading"] },
];
