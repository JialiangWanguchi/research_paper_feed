alter table public.topics add column if not exists keywords text[] not null default '{}';

update public.topics
set keywords = case slug
  when 'agents' then array['agent', 'agents', 'tool use', 'tool-use', 'web agent', 'planning']
  when 'long-context' then array['long context', 'context window', 'needle in a haystack', 'retrieval']
  when 'multimodal' then array['multimodal', 'vision-language', 'image-text', 'audio-text', 'video']
  when 'interpretability' then array['interpretability', 'mechanistic', 'activation', 'probing', 'explanation']
  else keywords
end
where coalesce(array_length(keywords, 1), 0) = 0;

drop policy if exists "topics_insert_authenticated" on public.topics;
create policy "topics_insert_authenticated"
on public.topics for insert
to authenticated
with check (true);
