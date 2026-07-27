'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.18 }} className="relative bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-2xl z-10 w-full max-w-2xl backdrop-blur-md">
            {title ? <h3 className="text-lg font-semibold mb-3">{title}</h3> : null}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
