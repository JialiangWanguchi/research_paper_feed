# AGENTS.md

## Project Overview
This repository contains a monorepo for a Week 4 MPCS Design, Build, Ship assignment.

Architecture:
- apps/web: Next.js + Tailwind frontend deployed to Vercel
- apps/worker: Node.js background worker deployed to Railway
- Supabase: Postgres database, auth, and realtime subscriptions

The app is a Research Paper Live Tracker.
Users sign in, choose research topics they want to follow, and see newly polled papers appear in real time.

## Requirements
This project must satisfy the course Week 4 assignment requirements:
- Monorepo structure
- Frontend in Next.js + Tailwind
- Worker polls an external data source
- Worker writes to Supabase
- Frontend reads from Supabase
- Realtime updates via Supabase Realtime
- User auth
- Personalized user preferences
- Deploy web to Vercel and worker to Railway
- Keep a CLAUDE.md file at repo root describing architecture

## Important Rules
- Do not remove CLAUDE.md
- Do not put secret keys in client-side code
- Use environment variables for all credentials
- Keep the implementation simple and shippable
- Prefer incremental commits and small changes
- Always explain planned file changes before making large edits

## Web App Features
- Sign up / sign in
- Topic selection page
- Personalized feed page
- Save / unsave papers
- Realtime updates when new matching papers arrive

## Data Model
Expected tables:
- papers
- user_topics
- saved_papers
- optional: poll_runs

## Worker Responsibilities
- Poll paper source on an interval
- Normalize records
- Upsert papers into Supabase
- Avoid duplicates
- Log polling status

## Done Means
A classmate can:
- open the Vercel app
- create an account
- choose topics
- see papers in their personalized feed
- observe new papers appear without refreshing