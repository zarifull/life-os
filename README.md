# 🧬 LifeOS | Personal Ecosystem

**"Clean Data, Deep Focus."**

LifeOS is a high-performance productivity suite built on the philosophy of architectural elegance. This system bridges the gap between technical project tracking and personal energy management through a high-saturation Liquid Glassmorphism interface. It is designed for those who view productivity not just as a task list, but as a surgical optimization of life's primary resources.

---

## 🕹️ System Walkthrough (The User Journey)

### 1. 🔐 Secure Entry & Hybrid Auth
The experience begins with a dual-layer security protocol.
* **Secure Access**: A custom-built PIN-code overlay provides a secondary layer of verification for sensitive data.
* **System Encryption**: Full integration with Supabase Auth (GoTrue) ensures a "System Encrypted" environment.

### 2. 🧠 Temporal Intelligence (Dashboard)
Once unlocked, the system provides immediate contextual awareness.
* **Year Visualization**: A macro-view of the current year (e.g., "128 of 365") to track temporal progress.
* **Focus Metrics**: Real-time tracking of "Days Lived" vs. "Days Ahead" to drive urgency and focus.

### 3. 📝 Tactical Planning (Intentions)
A clean, serif-driven interface for daily objectives.
* **Intentions Engine**: Explicitly separates objectives into "Today" and "Tomorrow" to reduce cognitive load.
* **Progress Tracking**: Integrated completion counters (e.g., "0/2 Achieved") maintain psychological momentum.

### 4. 🔋 Energy & Biometric Logging
A pixel-perfect module designed to track the user's primary resource: Energy.
* **Visual Batteries**: Real-time logging of energy levels with color-coded gradients.
* **Historical Lookback**: A 30-day window to correlate yesterday's energy with today's performance.

### 5. 💰 My Finance (Wealth Tracker)
A sophisticated dashboard for strategic revenue tracking and "Burn" analysis.
* **Dynamic System Tax**: An automated calculation engine that identifies and aggregates recurring "Obligations" (rent, taxes, utilities) directly from transaction data.
* **Multi-Currency Scaling**: Real-time conversion and localized formatting for KGS, USD, and RUB using live exchange rates.
* **Live Derived State**: Instant UI updates upon transaction entry or deletion, ensuring the "Daily Burn" is always accurate.

### 6. 🧭 Navigation & Core Modules
* 📖 **My Chronicle (Diary)**: A journaling engine for capturing achievements and insights with optimized mobile UX.
* ✨ **Vision Board**: A goal visualization engine featuring 4:5 aspect ratio cards and an ergonomic Action Dock.

---

## 📂 Architecture & Directory Structure

```text

├── app/
│   ├── [locale]/                   # Localized App Router Core (i18n Wrapped)
│   │   ├── (auth)/                 # Semantic Route Group for Entry Management
│   │   │   ├── login/              # Secure Email Sign-In Component Layer
│   │   │   └── reset-password/     # Secure Identity & PIN Recovery View
│   │   ├── dashboard/              # Core Productivity Center
│   │   │   ├── _components/        # Structural Presentation UI (UserNav, PlanCard)
│   │   │   ├── _sections/          # Functional Business Splitting (EnergySection, PlanSection)
│   │   │   ├── settings/           # Privacy Controls & Security Cards
│   │   │   └── tomorrow/           # Intentions Anticipation View
│   │   ├── diary/                  # My Chronicle Journaling Engine
│   │   ├── finance/                # Strategic Wealth Tracker & Derived State Calculations
│   │   ├── history/                # 30-Day Aggregation Matrices (Energy, Finance, Plans)
│   │   ├── vision/                 # Visual Goal Target Mapping & Action Docks
│   │   ├── layout.tsx              # Root Dynamic Frame & Metadata Controller
│   │   └── page.tsx                # Contextual Localized Landing Point
│   └── api/                        # Next.js Serverless Edge Routes
│       ├── finance/                # Financial Data Transaction Processor
│       ├── memories/               # Diary Serialization Layer
│       ├── pin/                    # Biometric Custom Hash Validator
│       └── plans/                  # Intentions Matrix CRUD Service
├── lib/                            # Application Shared Execution Utilities
│   ├── actions/                    # Next.js Server Actions (energy.ts, plans.ts, vision.ts)
│   ├── db/                         # Relational Mapping Framework Client (prisma.ts)
│   └── supabase/                   # SSR Server and Browser Client Initialization Factory
├── prisma/                         # Database Migration Blueprints & Operational Schema
│   ├── schema.prisma               # Strict Type Models for Users, Profiles, and Finances
│   └── supabase-init.sql           # Remote Initialization SQL Script
├── messages/                       # Dictionary Translation Matrix Objects (en, kg, ru)
├── types/                          # Domain Specific Global TypeScript Overrides
└── proxy.ts                        # Request Interceptor, Security Firewall & Session Synchronizer

🛠️ Technical Specifications
Engine: Next.js 16/15+ (App Router) with Turbopack for lightning-fast development.

Language: TypeScript (Strict Mode) for professional-grade type safety and reliability.

Database: PostgreSQL via Supabase with strict Row Level Security (RLS) policies.

Proxy Optimization: Native request interception to securely handle multi-language redirects without cookie degradation.

Testing Suite: Robust unit and integration testing powered by Vitest, ensuring 100% logic accuracy for financial and temporal calculations.

i18n: Full internationalization support for English, Russian, and Kyrgyz via next-intl.

UI/UX: Tailwind CSS with 60px backdrop blurs and 1.5px specular edges for a premium "Liquid Glass" feel.

🚀 Getting Started
1. Clone & Install
Bash
git clone [https://github.com/zarifull/life-os-app.git](https://github.com/zarifull/life-os-app.git)
cd life-os-app
npm install
2. Environment Setup
Create a .env.local file in the root directory and append your service nodes:

Code snippet
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
3. Run Test Verification Suites
Verify structural math and state logic accuracy before execution:

Bash
npx vitest run
4. Production Build & Execution
Bash
npm run build
npm run start
☁️ Deployment

This system is optimized to deploy directly onto Vercel with full Support for Next.js Dynamic Edge Functions:

Link your GitHub repository to Vercel.

Under Environment Variables, mirror your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.

Set your production deployment build configuration to use the standard Next.js preset.

Author: Zarina — Specializing in High-Performance Web Architectures and Surgical UI Design.
