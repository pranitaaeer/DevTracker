'use client';

import React, { useMemo, useState } from 'react';

type Props = {
  contributions: Record<string, number>;
  full?: boolean;
};

export default function Heatmap({ contributions, full = false }: Props) {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const years = ['2026', '2025', '2024'];

  const totalWeeks = full ? 52 : 16;
  const totalDays = totalWeeks * 7;

  const { days, monthLabels } = useMemo(() => {
    const dayList = [];
    const months: { name: string; index: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < totalDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (totalDays - 1 - i));
      const key = date.toISOString().split('T')[0];

      const currentMonth = date.getMonth();
      const weekIndex = Math.floor(i / 7);

      if (currentMonth !== lastMonth && i % 7 === 0) {
        months.push({
          name: date.toLocaleString('default', { month: 'short' }),
          index: weekIndex,
        });
        lastMonth = currentMonth;
      }

      dayList.push({
        date: key,
        count: contributions[key] || 0,
      });
    }

    return { days: dayList, monthLabels: months };
  }, [contributions, totalDays]);

  const getColor = (count: number) => {
    if (count === 0)
      return 'bg-zinc-100 dark:bg-[#161b22] border border-zinc-200/60 dark:border-transparent';

    if (count <= 1) return 'bg-[#0e4429]';
    if (count <= 3) return 'bg-[#006d32]';
    if (count <= 5) return 'bg-[#26a641]';

    return 'bg-[#39d353]';
  };

  return (
    <div className="w-full select-none">
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
        {/* Left: Heatmap Grid Container */}
        <div className="flex-1 min-w-0 w-full">
          {/* Header Info */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              {Object.values(contributions).reduce((a, b) => a + b, 0)} contributions in {selectedYear}
            </h3>
          </div>

          {/* Grid Wrapper */}
          <div className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="w-max">
              {/* Months Header Row */}
              <div className="flex text-[10px] text-zinc-500 dark:text-zinc-400 mb-1 pl-7 relative h-4">
                {monthLabels.map((m, idx) => (
                  <span
                    key={idx}
                    className="absolute"
                    style={{ left: `${m.index * 13 + 28}px` }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              {/* Grid with Left Day Labels */}
              <div className="flex gap-2 items-start">
                <div className="grid grid-rows-7 gap-[3px] text-[10px] text-zinc-500 dark:text-zinc-400 leading-[10px] pt-[12px]">
                  <span className="h-[10px]"></span>
                  <span className="h-[10px]">Mon</span>
                  <span className="h-[10px]"></span>
                  <span className="h-[10px]">Wed</span>
                  <span className="h-[10px]"></span>
                  <span className="h-[10px]">Fri</span>
                  <span className="h-[10px]"></span>
                </div>

                <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                  {days.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} contributions`}
                      className={`w-[10px] h-[10px] rounded-[2px] cursor-pointer ${getColor(
                        day.count
                      )} transition-transform duration-100 hover:scale-125`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between mt-4 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span className="hover:underline cursor-pointer">
              Learn how we count contributions
            </span>

            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <span className="w-2.5 h-2.5 rounded-[2px] bg-zinc-100 dark:bg-[#161b22] border border-zinc-200/60 dark:border-transparent" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#0e4429]" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#006d32]" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#26a641]" />
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#39d353]" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Right: Year Selection Buttons (Sirf Full View Par Dikhne ke liye) */}
        {full && (
          <div className="flex flex-col gap-1.5 w-full md:w-28 shrink-0 md:pt-8">
            {years.map((year) => {
              const isSelected = selectedYear === year;
              return (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium rounded-xl transition-all duration-150 ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  {year}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}