"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

type AuthState = {
  error: string | null;
  success: string | null;
};

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function AuthPanel({
  title,
  description,
  action,
  submitLabel,
  pendingLabel,
}: {
  title: string;
  description: string;
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  submitLabel: string;
  pendingLabel: string;
}) {
  const [state, formAction] = useActionState(action, {
    error: null,
    success: null,
  });

  return (
    <div className="rounded-[2rem] bg-[#fffdf8] p-6 ring-1 ring-black/10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-black/65">{description}</p>
      <form action={formAction} className="mt-5 space-y-4">
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 outline-none"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full rounded-2xl border border-black/15 bg-white px-4 py-3 outline-none"
          required
        />
        <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-pine">{state.success}</p> : null}
      </form>
    </div>
  );
}

export function LoginForm({
  signInAction,
  signUpAction,
}: {
  signInAction: (state: AuthState, formData: FormData) => Promise<AuthState>;
  signUpAction: (state: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  return (
    <div className="mt-8 grid gap-5">
      <AuthPanel
        title="Sign in"
        description="Use email and password to sign in without waiting for a magic link."
        action={signInAction}
        submitLabel="Sign in"
        pendingLabel="Signing in..."
      />
      <AuthPanel
        title="Create account"
        description="Create a new account. Depending on your Supabase settings, email confirmation may still be required once."
        action={signUpAction}
        submitLabel="Create account"
        pendingLabel="Creating..."
      />
    </div>
  );
}
