🧬 LifeOS | Personal Ecosystem
A high-performance, Liquid Glassmorphism productivity suite designed for total life management. This system bridges the gap between technical project tracking and personal energy management.

🛠️ Technical Stack
Framework: Next.js 15+ (App Router)

Language: TypeScript (Strict Mode)

Styling: Tailwind CSS (Utility-first)

Database & Auth: Supabase (PostgreSQL + GoTrue)

Internationalization: next-intl (EN | RU | KY support)

🛡️ Core Features (V1.0)
Hybrid Authentication: Combines standard Supabase Email/Password login with a custom Secure PIN-code Overlay for secondary verification.

Recovery Loop: Seamless "Forgot PIN" integration that triggers a secure email recovery flow back to the reset-identity module.

Liquid UI: A pixel-perfect implementation of Glassmorphism focusing on transparency, backdrop blurs, and tactile feedback.

Multilingual Support: Fully translated interface supporting English, Russian, and Kyrgyz.

🚀 Upcoming Optimizations
Energy Tracking: Daily metrics visualization with liquid glass sliders.

Life Management Modules: Integration of finance tracking and planning modules.

Performance: Advanced browser performance tuning (EPAM Standard).

🏗️ Getting Started
Clone the repository:

Bash
git clone https://github.com/your-username/life-os.git
Install dependencies:

Bash
npm install

3. **Environment Setup:** Create a `.env.local` file with your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Run Development:**

   ```bash
   npm run dev
