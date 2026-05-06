🧬 LifeOS | Personal Ecosystem
"Clean Data, Deep Focus."

A high-performance, Liquid Glassmorphism productivity suite built to bridge the gap between technical project tracking and personal energy management. LifeOS is designed for total life management, operating on a philosophy of architectural elegance and high-performance UX.

🛠️ Technical Stack
Framework: Next.js 15+ (App Router).

Language: TypeScript (Strict Mode).

Styling: Tailwind CSS (Utility-first) with custom glassmorphism filters.

ORM: Prisma for type-safe database queries.

Database & Auth: Supabase (PostgreSQL + GoTrue).

Animation: Framer Motion for fluid layout transitions.

Internationalization: next-intl with full support for English, Russian, and Kyrgyz.

🛡️ Core Features (V1.0)
1. 🧠 Contextual Awareness & Intelligence
Dynamic Greeting Engine: Adapts to the user’s local hour (Morning, Afternoon, Evening) and selected language.

Temporal Visualization: Dashboard tracking the current day of the year (e.g., "125 of 365") to enhance temporal awareness and focus.

2. 💰 Finance Module & Archive (New)
Multi-Currency Logic: Integrated support for KGS, USD, and RUB with real-time scaling and localized formatting.

Financial Library: A sophisticated Archive Engine that groups historical transactions by month, providing data-driven insights into surplus and spending.

Full CRUD Integration: Secure logging of income and expenses with real-time UI/Database synchronization.

3. 🔋 Energy & Biometric Logging
Liquid Glass UI: Pixel-perfect implementation featuring 80px organic border-radii, 1.5px specular edges, and high-saturation backdrop blurs (blur: 60px).

Performance Optimization: Automated pg_cron tasks to maintain a clean 30-day lookback window, ensuring the system remains high-performance.

4. 📖 Personal Narrative & Temporal Planning
Future Protocol: Architectural routing that separates objectives into Today, Tomorrow, and a filtered History Archive based on target-date logic.

Reflective Journaling: A dedicated "My Diary" module for capturing achievements and daily insights with optimized mobile UX.

Mobile-First Design: Floating Action Back-Buttons (FAB) and adaptive grid layouts for ergonomic thumb-navigation.

5. 🔐 Hybrid Security
Dual-Layer Entry: Combines Supabase Auth with a custom Secure PIN-code Overlay for secondary verification.

Row Level Security (RLS): Strict PostgreSQL policies ensuring complete data isolation per user.

📡 Architecture: Data Lifecycle
On-Conflict Upsert: Seamless data updates using composite unique keys (user_id, date) to prevent duplicates.

Timezone Resilience: Implementation of normalized date strings to prevent UTC "date-bleed" across Central Asian timezones.

Strict Type-Safety: End-to-end TypeScript interfaces mapping database schemas directly to React components to eliminate runtime crashes.

🚀 Upcoming Optimizations
Insight Engine: Data visualization (Recharts) correlating energy levels with plan completion rates.

PWA Integration: Transforming LifeOS into a Progressive Web App for a native mobile experience.

🏗️ Getting Started
Clone the repository:

Bash
git clone https://github.com/zarifull/life-os-app.git
Install dependencies:

Bash
npm install

3.  **Environment Setup**: Create a `.env.local` file:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    DATABASE_URL=your_prisma_url
    ```
4.  **Run Development**:
    ```bash
    npm run dev
    ```

---

**Author**: **Zarina** — Full-Stack Developer specializing in React, Node.js, and High-Performance Web Architectures.
