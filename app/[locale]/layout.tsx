import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales } from "../../i18n/request";
import { LifeOSShell } from "./LifeOSShell";

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

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="antialiased selection:bg-blue-100 selection:text-blue-900" >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <LifeOSShell>{children}</LifeOSShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}