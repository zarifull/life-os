🧬 LifeOS | Personal Ecosystem
A high-performance, Liquid Glassmorphism productivity suite designed for total life management. This system bridges the gap between technical project tracking and personal energy management, operating on a philosophy of "Clean Data, Deep Focus."

🛠️ Technical Stack
Framework: Next.js 15+ (App Router)

Language: TypeScript (Strict Mode)

Styling: Tailwind CSS (Utility-first)

Database & Auth: Supabase (PostgreSQL + GoTrue)

Animation: Framer Motion

Internationalization: next-intl (EN | RU | KY support)

🛡️ Core Features (V1.0)

1. 🧠 Contextual Awareness & UX

Dynamic Greeting Engine: A time-aware greeting system that adapts to the user's local hour (Morning, Afternoon, Evening) and language.

Temporal Visualization: A high-performance dashboard that visualizes the current day of the year (e.g., "125 of 365") to foster a sense of temporal awareness and focus.

2. Hybrid Authentication & Security
Dual-Layer Entry: Combines standard Supabase Email/Password login with a custom Secure PIN-code Overlay for secondary verification.

Row Level Security (RLS): Strict PostgreSQL policies ensuring users can only interact with their own data.

3. The "Future Protocol" & Temporal Planning
Intelligent Routing: Architecture that separates plans into Today, Tomorrow, and a 30-day History Archive based on Target Date logic.

Archive Engine: A filtered historical view grouping data by date with automated progress metrics.

4. 🔋 Energy & Biometric Logging
Liquid Glass UI: A pixel-perfect implementation focusing on transparency, 3px solid white borders, and 40px backdrop blurs.

Automated Data Retention: Integrated pg_cron tasks to purge logs older than 30 days, maintaining peak performance.

5. 📖 Personal Narrative & Diary (New Phase)
Reflective Journaling: A dedicated "My Diary" (formerly Notebook) module for capturing achievements, goals, and daily insights.

Optimized Mobile UX: Adaptive grid layouts with localized button widths and a Floating Action Back-Button (FAB) for ergonomic thumb-navigation.

Full CRUD Integration: Real-time Create, Read, Update, and Delete capabilities with defensive error handling to ensure UI/Database synchronization.

📡 Architecture: Data Lifecycle
On-Conflict Upsert: Uses composite unique keys (user_id, date) to update data seamlessly without duplicates.

Timezone Resilience: Implements normalized date strings to prevent UTC "date-bleed" in regions like Central Asia.

Strict Type-Safety: End-to-end TypeScript interfaces mapping Supabase schemas to React components to prevent runtime crashes.

🚀 Upcoming Optimizations
Insight Engine: Data visualization charts (Recharts) correlating Energy levels with Plan completion rates.

PWA Integration: Transforming the suite into a Progressive Web App for a native mobile experience.

Finance Module: A secure planning module for personal financial tracking and budget forecasting.

🏗️ Getting Started
Clone the repository:

Bash
git clone https://github.com/zarifull/life-os-app.git
Install dependencies:

Bash
npm install
Environment Setup: Create a .env.local file with your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.

Run Development:

Bash
npm run dev

Author: Zarina — Full-Stack Developer specializing in React, Node.js, and High-Performance Web Architectures.