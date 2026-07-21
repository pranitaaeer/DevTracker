'use client';
import React from 'react';

export default function AnimatedNumber({ value, format }: { value: number; format?: (n: number) => string }) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const start = display;
    const delta = value - start;
    const duration = 300;
    const startTime = performance.now();

    let raf: number;
    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      setDisplay(Math.round((start + delta * progress) * 10) / 10);
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className="font-semibold text-2xl text-slate-900 dark:text-white">{format ? format(display) : display}</span>;
}
