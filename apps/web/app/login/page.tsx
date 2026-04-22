import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/url";

async function signIn(formData: FormData) {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return;
  }

  const supabase = await createClient();
  const baseUrl = await getBaseUrl();
  await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });

  redirect("/");
}

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Authentication</p>
        <h1 className="mt-3 text-3xl font-semibold">Sign in with email</h1>
        <p className="mt-3 text-sm text-black/70">
          Supabase magic-link auth is the minimal path for this assignment.
        </p>
        <form action={signIn} className="mt-8 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-black/15 bg-sand px-4 py-3 outline-none"
            required
          />
          <button className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">
            Send magic link
          </button>
        </form>
      </div>
    </main>
  );
}
