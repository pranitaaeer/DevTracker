'use client';

import Toaster from '@/components/Toaster'; // Aapka visual framer-motion toaster
import { useUIStore } from '@/stores/useUIStore';

export default function GlobalToaster() {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  return <Toaster toasts={toasts} onDismiss={removeToast} />;
}