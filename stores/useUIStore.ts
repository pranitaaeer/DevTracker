'use client';
import { create } from 'zustand';

type Toast = { id: string; title: string; description?: string; action?: { label: string; onClick: () => void } };

type UIState = {
  toasts: Toast[];
  addToast: (t: Omit<Toast, 'id'>, timeout?: number) => string;
  removeToast: (id: string) => void;
  confirm: { open: boolean; title?: string; description?: string; onConfirm?: () => void };
  openConfirm: (cfg: { title?: string; description?: string; onConfirm?: () => void }) => void;
  closeConfirm: () => void;
};

function uid(prefix = '') { return prefix + Math.random().toString(36).slice(2, 9); }

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  addToast: (t, timeout = 5000) => {
    const id = uid('t-');
    const toast = { id, ...t } as Toast;
    set((s: any) => ({ toasts: [toast, ...s.toasts] }));
    if (timeout > 0) setTimeout(() => get().removeToast(id), timeout);
    return id;
  },
  removeToast: (id) => set((s: any) => ({ toasts: s.toasts.filter((x: Toast) => x.id !== id) })),
  confirm: { open: false },
  openConfirm: (cfg) => set(() => ({ confirm: { open: true, ...cfg } })),
  closeConfirm: () => set(() => ({ confirm: { open: false } }))
}));
