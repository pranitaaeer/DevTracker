'use client';

import React from 'react';

type Props = {
  contributions: Record<string, number>;
};

export default function Heatmap({ contributions }: Props) {

  const days = Array.from({ length: 140 }).map((_, i) => {
    const date = new Date();

    date.setDate(date.getDate() - (139 - i));

    const key = date.toISOString().split('T')[0];

    return {
      date: key,
      count: contributions[key] || 0,
    };
  });


  const getColor = (count: number) => {
    if (count === 0)
      return 'bg-[#161b22]';

    if (count <= 1)
      return 'bg-[#0e4429]';

    if (count <= 3)
      return 'bg-[#006d32]';

    if (count <= 5)
      return 'bg-[#26a641]';

    return 'bg-[#39d353]';
  };


  return (
    <div className="
      rounded-xl
      border
      border-zinc-800
      bg-[#0d1117]
      p-5
    ">

      <div className="flex justify-between mb-4">

        <div>
          <h3 className="text-sm font-semibold text-white">
            Contributions
          </h3>

          <p className="text-xs text-zinc-500 mt-1">
            Developer activity
          </p>
        </div>

        <span className="text-xs text-zinc-500">
          Last 20 weeks
        </span>

      </div>


      <div className="
        grid
        grid-rows-7
        grid-flow-col
        gap-[4px]
        overflow-hidden
      ">

        {days.map((day) => (
          <div
            key={day.date}
            title={`${day.date}: ${day.count} contributions`}
            className={`w-[12px] h-[12px] rounded-[3px] cursor-pointer ${getColor(day.count)} transition-transform duration-150 hover:scale-110`}
          />
        ))}

      </div>


      <div className="
        flex
        items-center
        justify-end
        gap-2
        mt-4
        text-xs
        text-zinc-500
      ">
        Less

        <span className="w-3 h-3 rounded-sm bg-[#161b22]" />
        <span className="w-3 h-3 rounded-sm bg-[#0e4429]" />
        <span className="w-3 h-3 rounded-sm bg-[#006d32]" />
        <span className="w-3 h-3 rounded-sm bg-[#26a641]" />
        <span className="w-3 h-3 rounded-sm bg-[#39d353]" />

        More
      </div>

    </div>
  );
}