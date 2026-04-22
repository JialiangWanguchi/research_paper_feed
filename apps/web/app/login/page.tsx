import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/login-form";
import { getBaseUrl } from "@/lib/url";

type LoginState = {
  error: string | null;
  success: string | null;
};

function validateCredentials(formData: FormData): { email: string; password: string } | LoginState {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email) {
    return {
      error: "Enter an email address first.",
      success: null,
    };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
      success: null,
    };
  }

  return { email, password };
}

async function signInWithPassword(_: LoginState, formData: FormData): Promise<LoginState> {
  "use server";

  const credentials = validateCredentials(formData);
  if ("error" in credentials) {
    return credentials;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return {
      error: error.message,
      success: null,
    };
  }

  redirect("/");
}

async function signUpWithPassword(_: LoginState, formData: FormData): Promise<LoginState> {
  "use server";

  const credentials = validateCredentials(formData);
  if ("error" in credentials) {
    return credentials;
  }

  const supabase = await createClient();
  const baseUrl = await getBaseUrl();
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    return {
      error: error.message,
      success: null,
    };
  }

  if (data.session) {
    redirect("/");
  }

  return {
    error: null,
    success: "Account created. If email confirmation is enabled, check your inbox once and then sign in with your password.",
  };
}

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-black/10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Authentication</p>
        <h1 className="mt-3 text-3xl font-semibold">Email and password access</h1>
        <p className="mt-3 text-sm text-black/70">
          Use password-based auth for a more stable demo flow on Vercel.
        </p>
        <LoginForm signInAction={signInWithPassword} signUpAction={signUpWithPassword} />
      </div>
    </main>
  );
}
