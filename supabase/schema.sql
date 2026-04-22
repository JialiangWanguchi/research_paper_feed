create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null unique,
  keywords text[] not null default '{}',
  source_categories text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.topics add column if not exists keywords text[] not null default '{}';
alter table public.topics add column if not exists source_categories text[] not null default '{}';

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'arxiv',
  source_id text not null,
  title text not null,
  abstract text not null default '',
  url text not null,
  authors jsonb not null default '[]'::jsonb,
  published_at timestamptz not null,
  raw_categories text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (source, source_id)
);

create table if not exists public.paper_topics (
  paper_id uuid not null references public.papers (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  matched_keywords text[] not null default '{}',
  created_at timestamptz not null default now(),
  primary key (paper_id, topic_id)
);

create table if not exists public.user_topic_follows (
  user_id uuid not null references public.profiles (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create table if not exists public.saved_papers (
  user_id uuid not null references public.profiles (id) on delete cascade,
  paper_id uuid not null references public.papers (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, paper_id)
);

create index if not exists papers_published_at_idx on public.papers (published_at desc);
create index if not exists paper_topics_topic_id_idx on public.paper_topics (topic_id);
create index if not exists follows_topic_id_idx on public.user_topic_follows (topic_id);

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

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.topics enable row level security;
alter table public.papers enable row level security;
alter table public.paper_topics enable row level security;
alter table public.user_topic_follows enable row level security;
alter table public.saved_papers enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id);

drop policy if exists "topics_read_authenticated" on public.topics;
drop policy if exists "topics_read_public" on public.topics;
create policy "topics_read_public"
on public.topics for select
to anon, authenticated
using (true);

drop policy if exists "topics_insert_authenticated" on public.topics;
create policy "topics_insert_authenticated"
on public.topics for insert
to authenticated
with check (true);

drop policy if exists "papers_read_authenticated" on public.papers;
drop policy if exists "papers_read_public" on public.papers;
create policy "papers_read_public"
on public.papers for select
to anon, authenticated
using (true);

drop policy if exists "paper_topics_read_authenticated" on public.paper_topics;
drop policy if exists "paper_topics_read_public" on public.paper_topics;
create policy "paper_topics_read_public"
on public.paper_topics for select
to anon, authenticated
using (true);

drop policy if exists "follows_select_own" on public.user_topic_follows;
create policy "follows_select_own"
on public.user_topic_follows for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "follows_insert_own" on public.user_topic_follows;
create policy "follows_insert_own"
on public.user_topic_follows for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "follows_delete_own" on public.user_topic_follows;
create policy "follows_delete_own"
on public.user_topic_follows for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "saved_select_own" on public.saved_papers;
create policy "saved_select_own"
on public.saved_papers for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "saved_insert_own" on public.saved_papers;
create policy "saved_insert_own"
on public.saved_papers for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "saved_delete_own" on public.saved_papers;
create policy "saved_delete_own"
on public.saved_papers for delete
to authenticated
using (auth.uid() = user_id);

do $$
begin
  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    where pr.prpubid = (select oid from pg_publication where pubname = 'supabase_realtime')
      and n.nspname = 'public'
      and c.relname = 'papers'
  ) then
    alter publication supabase_realtime add table public.papers;
  end if;

  if not exists (
    select 1
    from pg_publication_rel pr
    join pg_class c on c.oid = pr.prrelid
    join pg_namespace n on n.oid = c.relnamespace
    where pr.prpubid = (select oid from pg_publication where pubname = 'supabase_realtime')
      and n.nspname = 'public'
      and c.relname = 'paper_topics'
  ) then
    alter publication supabase_realtime add table public.paper_topics;
  end if;
end $$;
