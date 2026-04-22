"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

type LoginState = {
  error: string | null;
  success: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
    >
      {pending ? "Sending..." : "Send magic link"}
    </button>
  );
}

export function LoginForm({
  action,
}: {
  action: (state: LoginState, formData: FormData) => Promise<LoginState>;
}) {
  const [state, formAction] = useActionState(action, {
    error: null,
    success: null,
  });

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input
        type="email"
        name="email"
        placeholder="you@example.com"
        className="w-full rounded-2xl border border-black/15 bg-sand px-4 py-3 outline-none"
        required
      />
      <SubmitButton />
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-pine">{state.success}</p> : null}
    </form>
  );
}
