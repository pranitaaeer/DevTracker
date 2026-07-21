import './globals.css';
import React from 'react';
import AppShell from '@/components/AppShell';

export const metadata = {
  title: 'DevTrack',
  description: 'Developer Operating System — track projects, coding activity, and growth'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
