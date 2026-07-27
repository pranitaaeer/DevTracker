import './globals.css';
import React from 'react';
import AppShell from '@/components/AppShell';
import { ClerkProvider } from '@/lib/components/clerk-provider';

export const metadata = {
  title: 'DevTrack',
  description: 'Developer Operating System — track projects, coding activity, and growth',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <AppShell>{children}</AppShell>
        </ClerkProvider>
      </body>
    </html>
  );
}