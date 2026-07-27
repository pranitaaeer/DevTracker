import './globals.css';
import React, { Suspense } from 'react';
import AppShell from '@/components/AppShell';
import { ClerkProvider } from '@/lib/components/clerk-provider';
import GlobalToaster from '@/components/GlobalToaster';
import HomeAuthErrorListener from '@/components/HomeAuthErrorListener';

export const metadata = {
  title: 'DevTrack',
  description: 'Developer Operating System — track projects, coding activity, and growth',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider
          appearance={{
            elements: {
              modalBackdrop: 'backdrop-blur-md bg-black/50',
            },
          }}
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          afterSignOutUrl="/"
        >
          <AppShell>
            {/* Listener for handling unauthorized access redirects */}
            <Suspense fallback={null}>
              <HomeAuthErrorListener />
            </Suspense>

            {children}
            <GlobalToaster />
          </AppShell>
        </ClerkProvider>
      </body>
    </html>
  );
}