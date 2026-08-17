# LifeOS — Personal Productivity & Finance App

Full-stack personal productivity system for daily planning, energy tracking, journaling, and multi-currency finance management.

🔗 **Live Demo:** [life-os-two-lime.vercel.app](https://life-os-two-lime.vercel.app)

---

## What it does

- **Dashboard** — Year progress tracker, days lived vs ahead, focus metrics
- **Daily Planning** — Separate today/tomorrow intentions with completion tracking
- **Energy Logging** — Visual battery-style energy levels with 30-day history
- **Finance Tracker** — Multi-currency (KGS/USD/RUB), dynamic tax engine, live derived state
- **Diary** — Personal journaling with mobile-optimized UX
- **Vision Board** — Goal visualization with 4:5 cards and action dock
- **Auth** — Supabase GoTrue + custom PIN overlay for sensitive data
- **i18n** — Full support for English, Russian, and Kyrgyz

---

## Tech Stack

**Framework:** Next.js 16 (App Router, Turbopack)

**Language:** TypeScript (Strict Mode)

**Database:** PostgreSQL via Supabase (Row Level Security)

**ORM:** Prisma

**Testing:** Vitest — unit and integration tests for financial and temporal logic

**i18n:** next-intl with custom proxy routing layer

**Styling:** Tailwind CSS

**Deployment:** Vercel

---

## Architecture

**`app/[locale]/`** — Localized App Router (i18n wrapped)
- `(auth)/` — Login, reset password
- `dashboard/` — Main productivity hub
- `diary/` — Journaling
- `finance/` — Wealth tracker
- `history/` — 30-day aggregations
- `vision/` — Goal visualization

**`lib/`** — Shared utilities
- `actions/` — Server actions (energy, plans, vision)
- `db/` — Prisma client
- `supabase/` — SSR client setup

**`prisma/`** — Schema and migrations

**`messages/`** — i18n translations (EN, RU, KG)

**`types/`** — Global TypeScript types

**`proxy.ts`** — Custom routing & session sync

---

## Run Locally

```bash
git clone https://github.com/zarifull/life-os.git
cd life-os
npm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# Run tests
npx vitest run

# Start dev server
npm run dev
```

---

## Deployments

31 pull requests · 7 production deployments via Vercel
