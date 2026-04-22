# CLAUDE.md

## System
Research Paper Live Tracker

## Architecture
External paper source -> Railway worker -> Supabase database + realtime -> Next.js frontend on Vercel

## Frontend
- Next.js App Router
- Tailwind CSS
- Auth
- Personalized topic-based paper feed
- Realtime subscription to paper updates

## Worker
- Runs on Railway
- Polls external paper source every 5-10 minutes
- Normalizes paper metadata
- Upserts records into Supabase

## Database
Tables:
- papers
- user_topics
- saved_papers
- poll_runs (optional)

## Data Flow
1. Worker requests latest papers from external source
2. Worker parses and writes/upserts papers into Supabase
3. Supabase Realtime emits changes
4. Frontend subscribes to changes and updates the UI
5. Logged-in users only see papers matching their selected topics

## Auth & Personalization
Users can:
- sign up / sign in
- select topics to follow
- save papers
- see a personalized feed