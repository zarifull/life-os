import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(); // Бул автоматтык түрдө i18n/request.ts файлын табат

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack үчүн кошумча жөндөөлөр керек болсо ушул жерге
};

export default withNextIntl(nextConfig);