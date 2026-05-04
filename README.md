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
1. Hybrid Authentication & Security
Dual-Layer Entry: Combines standard Supabase Email/Password login with a custom Secure PIN-code Overlay for secondary verification.

Row Level Security (RLS): Strict PostgreSQL policies ensuring users can only interact with their own data.

2. The "Future Protocol" & Temporal Planning
Intelligent Routing: Architecture that separates plans into Today, Tomorrow, and a 30-day History Archive based on Target Date logic rather than creation timestamps.

Archive Engine: A filtered historical view grouping data by date with automated progress metrics (e.g., "5/8 Achieved").

3. 🔋 Energy & Biometric Logging (Phase 3)
Liquid Glass UI: A pixel-perfect implementation of Glassmorphism focusing on transparency, 3px solid white borders, and 40px backdrop blurs.

Dual-State Metrics: Capture "Today's Actuals" alongside "Tomorrow's Intentions" to visualize readiness.

Automated Data Retention: Integrated PostgreSQL pg_cron janitor tasks that instinctively purge logs older than 30 days to maintain system performance.

📡 Architecture: Data Lifecycle
Plan & Energy Persistence
On-Conflict Upsert: Uses composite unique keys (user_id, date) to ensure data is updated seamlessly without duplicates.

Timezone Resilience: Implements toLocaleDateString('en-CA') to normalize dates, preventing UTC "date-bleed" for users in regions like Kyrgyzstan.

Validation at Source: Enforced database Check Constraints (1-10 scale) to ensure data integrity before it reaches the UI.

🚀 Upcoming Optimizations
Insight Engine: Data visualization charts (Recharts) correlating Energy levels with Plan completion rates.

PWA Integration: Transforming the suite into a Progressive Web App for a native mobile experience.

Finance Module: Integrating a secure planning module for personal financial tracking.

🏗️ Getting Started
Clone the repository:

Bash
git clone https://github.com/your-username/life-os.git
Install dependencies:

Bash
npm install
Environment Setup: Create a .env.local file:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
Run Development:

Bash
npm run dev
Author: Self-taught Full-Stack Developer specializing in React, Node.js, and High-Performance Web Architectures.