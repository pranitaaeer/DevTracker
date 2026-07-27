'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/useUIStore';

export default function HomeAuthErrorListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addToast = useUIStore((s) => s.addToast);

  useEffect(() => {
    const error = searchParams.get('auth_error');

    if (error === 'please_login') {
      // Aapke existing store se toast trigger ho raha hai
      addToast({
        title: 'Please sign in first!',
        description: 'You need an active account to access this page.',
      }, 5000);

      // Clean URL params cleanly
      router.replace('/', { scroll: false });
    }
  }, [searchParams, router, addToast]);

  return null;
}