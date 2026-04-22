"use client";

import { useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";

export function SavePaperButton({
  paperId,
  userId,
  initialSaved,
}: {
  paperId: string;
  userId: string;
  initialSaved: boolean;
}) {
  const supabase = createClient();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function toggleSaved() {
    const nextSaved = !saved;
    setSaved(nextSaved);

    startTransition(async () => {
      if (nextSaved) {
        await supabase.from("saved_papers").insert({ user_id: userId, paper_id: paperId });
      } else {
        await supabase.from("saved_papers").delete().eq("user_id", userId).eq("paper_id", paperId);
      }
    });
  }

  return (
    <button
      onClick={toggleSaved}
      disabled={isPending}
      className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition ${
        saved
          ? "border-accent bg-accent text-white shadow-[0_10px_20px_rgba(217,108,6,0.28)]"
          : "border-ink/15 bg-white text-ink hover:border-accent hover:bg-[#fff1e3]"
      } ${isPending ? "opacity-70" : ""}`}
    >
      {saved ? "Saved" : "Save"}
    </button>
  );
}
