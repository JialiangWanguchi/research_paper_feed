"use client";

import { useMemo, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

type Topic = {
  id: string;
  slug: string;
  label: string;
  keywords?: string[] | null;
};

export function TopicPicker({
  topics,
  initialFollowed,
  userId,
}: {
  topics: Topic[];
  initialFollowed: string[];
  userId: string;
}) {
  const supabase = createClient();
  const [selected, setSelected] = useState(new Set(initialFollowed));
  const [availableTopics] = useState<Topic[]>(topics);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredTopics = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return availableTopics;
    }

    return availableTopics.filter((topic) => {
      const haystack = [
        topic.slug,
        topic.label,
        ...(topic.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [availableTopics, query]);

  function toggle(topic: Topic) {
    const topicKey = topic.id;
    const next = new Set(selected);
    const isSelected = next.has(topicKey);

    if (isSelected) {
      next.delete(topicKey);
    } else {
      next.add(topicKey);
    }

    setSelected(next);

    startTransition(async () => {
      if (isSelected) {
        await supabase.from("user_topic_follows").delete().eq("user_id", userId).eq("topic_id", topic.id);
      } else {
        await supabase.from("user_topic_follows").insert({ user_id: userId, topic_id: topic.id });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white/80 p-5 ring-1 ring-black/10 backdrop-blur">
        <label className="block text-xs uppercase tracking-[0.2em] text-black/55">Search topics</label>
        <div className="mt-3 flex flex-col gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try cs.DB, robotics, machine learning, speech..."
            className="w-full rounded-2xl border border-black/10 bg-[#fffdf8] px-4 py-3 outline-none ring-0 placeholder:text-black/35"
          />
          <p className="text-sm text-black/60">
            Search across the default topic catalog, then click cards to add or remove them from
            your feed.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from(selected).map((topicId) => {
          const topic = availableTopics.find((item) => item.id === topicId);
          if (!topic) {
            return null;
          }

          return (
            <button
              key={topic.id}
              onClick={() => toggle(topic)}
              className="rounded-full bg-pine px-4 py-2 text-sm font-medium text-white shadow-sm"
            >
              {topic.label} x
            </button>
          );
        })}
      </div>

      {filteredTopics.length === 0 ? (
        <div className="rounded-[2rem] bg-white/80 p-6 text-sm text-black/60 ring-1 ring-black/10">
          No matching topic in the current catalog.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredTopics.map((topic) => {
            const active = selected.has(topic.id);
            return (
              <button
                key={topic.id}
                onClick={() => toggle(topic)}
                className={`rounded-3xl border px-4 py-4 text-left transition ${
                  active
                    ? "border-pine bg-pine text-white shadow-lg shadow-emerald-100"
                    : "border-black/10 bg-white/85 text-ink shadow-sm"
                }`}
                disabled={isPending}
              >
                <div className="text-xs uppercase tracking-[0.18em] opacity-70">{topic.slug}</div>
                <div className="mt-2 text-lg font-semibold">{topic.label}</div>
                {(topic.keywords?.length ?? 0) > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topic.keywords?.slice(0, 4).map((keyword) => (
                      <span
                        key={`${topic.id}-${keyword}`}
                        className={`rounded-full px-2.5 py-1 text-[11px] ${
                          active ? "bg-white/15 text-white" : "bg-black/5 text-black/60"
                        }`}
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
