import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { createClient } from "@/lib/supabase/server";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "../../i18n/request";
import { LifeOSShell } from "./LifeOSShell";
import UserNav from "@/app/[locale]/dashboard/_components/layout/UserNav";

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!locales.includes(locale as any)) {
  notFound();
}

const messages = await getMessages();

const userNavComponent = user ? (
  <UserNav 
    email={user.email || ""} 
    name={user.user_metadata?.display_name || "User"} 
  />
) : null;

  return (
    <html lang={locale}>
      <body className="antialiased selection:bg-blue-100 selection:text-blue-900" >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LifeOSShell userNav={userNavComponent}>{children}</LifeOSShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}