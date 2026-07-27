'use client';

import React from 'react';
import { Pencil, Trash2, Calendar, GripVertical, MoveRight } from 'lucide-react';

type Card = { 
  id: string; 
  title: string; 
  description?: string; 
  projectId?: string; 
  priority?: string; 
  dueDate?: string 
};

type Column = { id: string; title: string; cards: Card[] };

export default function KanbanBoard({
  columns,
  onMove,
  onDeleteCard,
  onEditCard,
}: {
  columns: Column[];
  onMove?: (fromCol: string, toCol: string, cardId: string, toIndex?: number) => void;
  onDeleteCard?: (colId: string, cardId: string) => void;
  onEditCard?: (colId: string, card: Card) => void;
}) {
  function handleDragStart(e: React.DragEvent, fromColId: string, cardId: string) {
    e.dataTransfer.setData('application/json', JSON.stringify({ fromColId, cardId }));
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDropOnColumn(e: React.DragEvent, toColId: string) {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.cardId && data.fromColId) {
        onMove?.(data.fromColId, toColId, data.cardId, 0);
      }
    } catch (err) {}
  }

  function handleDropOnCard(e: React.DragEvent, toColId: string, toIndex: number) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.cardId && data.fromColId) {
        onMove?.(data.fromColId, toColId, data.cardId, toIndex);
      }
    } catch (err) {}
  }

  // Agli column ka ID nikalne ke liye function
  const getNextColumnId = (currentColIdx: number) => {
    const nextIdx = (currentColIdx + 1) % columns.length;
    return columns[nextIdx]?.id;
  };

  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div className="overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex gap-4 py-2 min-w-[760px] items-start">
        {columns.map((col, colIdx) => (
          <div
            key={col.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropOnColumn(e, col.id)}
            className="w-80 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 shadow-sm backdrop-blur-sm"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>{col.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                  {col.cards.length}
                </span>
              </h3>
            </div>

            {/* Cards Container */}
            <div className="flex flex-col gap-3 min-h-[100px]">
              {col.cards.map((card, idx) => {
                const nextColId = getNextColumnId(colIdx);

                return (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, col.id, card.id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDropOnCard(e, col.id, idx)}
                    className="group relative p-3.5 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm transition-all duration-150 hover:shadow-md cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Left: Drag Handle & Content */}
                      <div className="flex gap-2 flex-1 min-w-0">
                        <GripVertical
                          size={16}
                          className="text-zinc-400 dark:text-zinc-600 shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 transition-opacity"
                        />

                        <div className="flex-1 min-w-0">
                          <div
                            onClick={() => onEditCard?.(col.id, card)}
                            className="font-medium text-sm text-zinc-900 dark:text-zinc-100 hover:text-emerald-500 dark:hover:text-emerald-400 transition cursor-pointer truncate"
                          >
                            {card.title}
                          </div>

                          {card.description && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                              {card.description}
                            </p>
                          )}

                          {/* Priority & Due Date Badges */}
                          <div className="mt-3 flex items-center gap-2 text-[11px] flex-wrap">
                            {card.priority && (
                              <span
                                className={`px-2 py-0.5 rounded-md font-medium capitalize border ${getPriorityStyle(
                                  card.priority
                                )}`}
                              >
                                {card.priority}
                              </span>
                            )}

                            {card.dueDate && (
                              <span className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                                <Calendar size={12} />
                                {new Date(card.dueDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Sirf Ek Move Icon aur Ek Delete Icon */}
                      <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* 1. Move Icon (Agli Column Mein Move Karega) */}
                        {nextColId && (
                          <button
                            title="Move to Next Column"
                            onClick={() => onMove?.(col.id, nextColId, card.id, 0)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                          >
                            <MoveRight size={14} />
                          </button>
                        )}

                        {/* 2. Delete Icon */}
                        <button
                          title="Delete Card"
                          onClick={() => onDeleteCard?.(col.id, card.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}