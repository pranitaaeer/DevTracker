'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Toast = { id: string; title: string; description?: string; action?: { label: string; onClick: () => void } };

export default function Toaster({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="bg-white dark:bg-slate-800 border rounded-lg shadow-lg p-3 w-80">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{t.title}</div>
                {t.description ? <div className="text-sm text-slate-500">{t.description}</div> : null}
              </div>
              <div className="flex items-start gap-2">
                {t.action ? <button onClick={t.action.onClick} className="text-sm text-brand-500">{t.action.label}</button> : null}
                <button onClick={() => onDismiss(t.id)} className="text-sm text-slate-400">Dismiss</button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
