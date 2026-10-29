import "../globals.css";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "../../i18n/request";
import { LifeOSShell } from "./LifeOSShell";
import UserNav from "@/app/[locale]/dashboard/_components/layout/UserNav";
import { Metadata } from "next";

// Load clean font with swap display for zero layout shifts (CLS) & screen readability
const inter = Inter({ 
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    images: [
      {
        url: "/icon.png",
        width: 2000,
        height: 630,
        alt: "LifeOS Dashboard",
      },
    ],
  },
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://lifeos-system.vercel.app"
      : "http://localhost:3000"
  ),
  title: "LifeOS",
  description: "Personal productivity ecosystem",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Guard against invalid locales at entry point
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Concurrent data fetching on Node.js server
  const supabase = await createClient();
  const [{ data: { user } }, messages] = await Promise.all([
    supabase.auth.getUser(),
    getMessages(),
  ]);

  const userNavComponent = user ? (
    <UserNav
      email={user.email || ""}
      name={user.user_metadata?.display_name || "User"}
    />
  ) : null;

  return (
    <html lang={locale} className={inter.variable}>
      <body className={`${inter.className} antialiased selection:bg-blue-100 selection:text-blue-900 min-h-screen bg-background`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>

        <NextIntlClientProvider messages={messages} locale={locale}>
          <LifeOSShell userNav={userNavComponent}>
            <main id="main-content">
              {children}
            </main>
          </LifeOSShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}