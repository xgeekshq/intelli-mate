import '@/styles/globals.css';
import { Metadata } from 'next';
import Head from 'next/head';
import { siteConfig } from '@/site-config/site';
import { ClerkProvider } from '@clerk/nextjs';

import { fontSans } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/site-header';
import { ThemeProvider } from '@/components/theme-provider';
import Providers from '@/app/providers';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: 'white',
    },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <title>intelli-mate</title>
      </Head>
      <ClerkProvider>
        <body
          className={cn(
            'min-h-screen bg-background font-sans antialiased',
            fontSans.variable
          )}
          suppressHydrationWarning
        >
          <Providers>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <div className="relative flex h-screen flex-col">
                <SiteHeader />
                <div className="h-[calc(100vh-65px)]">{children}</div>
              </div>
            </ThemeProvider>
          </Providers>
          <Toaster />
        </body>
      </ClerkProvider>
    </html>
  );
}
