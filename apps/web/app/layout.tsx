import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Research Paper Live Tracker",
  description: "Personalized real-time feed of research papers by topic.",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="sticky top-0 z-20 border-b border-black/10 bg-white/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight no-underline">
                <span className="rounded-full bg-accent px-2 py-1 text-xs uppercase tracking-[0.22em] text-white">
                  Live
                </span>
                <span className="ml-3">Research Paper Tracker</span>
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/feed" className="no-underline text-ink/80 hover:text-ink">
                  Feed
                </Link>
                {user ? (
                  <>
                    <Link href="/topics" className="no-underline text-ink/80 hover:text-ink">
                      Topics
                    </Link>
                    <Link href="/saved" className="no-underline text-ink/80 hover:text-ink">
                      Saved
                    </Link>
                    <form action="/auth/signout" method="post">
                      <button className="rounded-full border border-black/15 bg-white px-3 py-1.5 shadow-sm">
                        Sign out
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="rounded-full bg-ink px-4 py-2 font-medium text-white no-underline"
                  >
                    Sign in
                  </Link>
                )}
              </nav>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
