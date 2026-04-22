import { createClient } from "@/lib/supabase/server";
import { getBaseUrl } from "@/lib/url";
import { LoginForm } from "@/components/login-form";

type LoginState = {
  error: string | null;
  success: string | null;
};

async function signIn(_: LoginState, formData: FormData): Promise<LoginState> {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return {
      error: "Enter an email address first.",
      success: null,
    };
  }

  const supabase = await createClient();
  const baseUrl = await getBaseUrl();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    const normalized = error.message.toLowerCase();
    const helpMessage =
      normalized.includes("redirect") || normalized.includes("email")
        ? `${error.message} Check Supabase Auth email settings and allowed redirect URLs.`
        : error.message;

    return {
      error: helpMessage,
      success: null,
    };
  }

  return {
    error: null,
    success: "Magic link sent. Check your inbox and spam folder.",
  };
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
        <LoginForm action={signIn} />
      </div>
    </main>
  );
}
