alter table public.topics add column if not exists source_categories text[] not null default '{}';

insert into public.topics (slug, label, keywords, source_categories)
values
  ('agents', 'Agents', array['agent', 'agents', 'tool use', 'web agent', 'autonomous agent'], array['cs.AI', 'cs.RO']),
  ('llms', 'LLMs', array['llm', 'llms', 'large language model', 'foundation model', 'instruction tuning'], array['cs.CL', 'cs.LG', 'cs.AI']),
  ('prompting', 'Prompting', array['prompt', 'prompting', 'prompt optimization', 'in-context learning'], array['cs.CL', 'cs.AI']),
  ('rag', 'RAG', array['rag', 'retrieval augmented generation', 'retrieval-augmented generation', 'grounded generation'], array['cs.IR', 'cs.CL', 'cs.AI']),
  ('long-context', 'Long Context', array['long context', 'context window', 'needle in a haystack', 'long-range'], array['cs.CL', 'cs.LG']),
  ('multimodal', 'Multimodal', array['multimodal', 'vision-language', 'image-text', 'audio-text', 'video-language'], array['cs.CV', 'cs.MM', 'cs.CL']),
  ('computer-vision', 'Computer Vision', array['vision', 'image segmentation', 'detection', 'visual recognition'], array['cs.CV']),
  ('nlp', 'Natural Language Processing', array['nlp', 'language model', 'machine translation', 'summarization'], array['cs.CL']),
  ('speech-audio', 'Speech and Audio', array['speech', 'audio', 'asr', 'text-to-speech', 'speaker'], array['cs.SD', 'eess.AS']),
  ('robotics', 'Robotics', array['robot', 'robotics', 'manipulation', 'navigation', 'embodied'], array['cs.RO']),
  ('reinforcement-learning', 'Reinforcement Learning', array['reinforcement learning', 'rl', 'policy optimization', 'bandit'], array['cs.LG', 'cs.AI']),
  ('reasoning', 'Reasoning', array['reasoning', 'chain of thought', 'deliberation', 'symbolic reasoning'], array['cs.AI', 'cs.CL']),
  ('alignment', 'Alignment', array['alignment', 'reward modeling', 'preference optimization', 'rlhf'], array['cs.AI', 'cs.LG']),
  ('safety', 'AI Safety', array['safety', 'harmlessness', 'red teaming', 'jailbreak'], array['cs.AI', 'cs.CR']),
  ('interpretability', 'Interpretability', array['interpretability', 'mechanistic', 'activation', 'probing', 'explanation'], array['cs.LG', 'cs.AI']),
  ('evaluation', 'Evaluation', array['evaluation', 'benchmark', 'leaderboard', 'judge model'], array['cs.AI', 'cs.CL', 'cs.LG']),
  ('information-retrieval', 'Information Retrieval', array['information retrieval', 'retrieval', 'search', 'ranking'], array['cs.IR']),
  ('knowledge-graphs', 'Knowledge Graphs', array['knowledge graph', 'entity linking', 'relation extraction'], array['cs.AI', 'cs.DB']),
  ('graphs-gnn', 'Graphs and GNNs', array['graph neural network', 'gnn', 'graph learning', 'heterogeneous graph'], array['cs.LG', 'cs.SI']),
  ('recommender-systems', 'Recommender Systems', array['recommendation', 'recommender system', 'ranking model'], array['cs.IR', 'cs.LG']),
  ('time-series', 'Time Series', array['time series', 'forecasting', 'temporal modeling'], array['cs.LG', 'stat.ML']),
  ('anomaly-detection', 'Anomaly Detection', array['anomaly detection', 'outlier detection', 'novelty detection'], array['cs.LG', 'stat.ML']),
  ('privacy-security', 'Privacy and Security', array['privacy', 'security', 'adversarial', 'federated'], array['cs.CR', 'cs.LG']),
  ('optimization', 'Optimization', array['optimization', 'solver', 'convex', 'non-convex'], array['math.OC', 'cs.LG']),
  ('systems', 'ML Systems', array['systems', 'serving', 'inference engine', 'throughput', 'latency'], array['cs.DC', 'cs.SE']),
  ('databases', 'Databases', array['database', 'query optimization', 'data management'], array['cs.DB']),
  ('distributed-systems', 'Distributed Systems', array['distributed system', 'distributed training', 'cluster', 'parallel'], array['cs.DC']),
  ('human-computer-interaction', 'HCI', array['human computer interaction', 'hci', 'user study', 'interface'], array['cs.HC']),
  ('healthcare-ai', 'Healthcare AI', array['medical', 'clinical', 'healthcare', 'biomedical'], array['q-bio.QM', 'cs.AI']),
  ('finance-econ-ml', 'Finance and Econ ML', array['finance', 'economic', 'trading', 'market prediction'], array['q-fin.ST', 'econ.EM'])
on conflict (slug) do update
set
  label = excluded.label,
  keywords = excluded.keywords,
  source_categories = excluded.source_categories;
