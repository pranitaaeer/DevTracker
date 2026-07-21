'use client';
import React from 'react';

type Card = { id: string; title: string; description?: string; projectId?: string; priority?: string; dueDate?: string };
type Column = { id: string; title: string; cards: Card[] };

export default function KanbanBoard({ columns, onMove, onDeleteCard, onEditCard }: { columns: Column[]; onMove?: (fromCol: string, toCol: string, cardId: string, toIndex?: number) => void; onDeleteCard?: (colId: string, cardId: string) => void; onEditCard?: (colId: string, card: Card) => void }) {
  // simple drag/drop using native API
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
    } catch (err) { }
  }

  function handleDropOnCard(e: React.DragEvent, toColId: string, toIndex: number) {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data && data.cardId && data.fromColId) {
        onMove?.(data.fromColId, toColId, data.cardId, toIndex);
      }
    } catch (err) { }
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-4 py-4 min-w-[760px]">
        {columns.map((col, colIdx) => (
          <div key={col.id} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDropOnColumn(e, col.id)} className="w-72 bg-gradient-to-b from-white/60 to-white/40 dark:from-slate-800/60 dark:to-slate-800/40 border border-slate-100 dark:border-slate-700 rounded-md p-3 shadow-lg backdrop-blur-sm">
            <h3 className="font-semibold mb-3">{col.title}</h3>
            <div className="flex flex-col gap-3">
              {col.cards.map((card, idx) => (
                <div key={card.id} draggable onDragStart={(e) => handleDragStart(e, col.id, card.id)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDropOnCard(e, col.id, idx)} className="p-3 bg-white/80 dark:bg-slate-900 rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div onClick={() => onEditCard?.(col.id, card)} className="cursor-pointer">
                      <div className="font-medium">{card.title}</div>
                      {card.description ? <div className="text-sm text-slate-500">{card.description}</div> : null}
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        {card.priority ? <span className={`px-2 py-0.5 rounded ${card.priority === 'high' ? 'bg-red-600 text-white' : card.priority === 'low' ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}>{card.priority}</span> : null}
                        {card.dueDate ? <span className="text-zinc-500">Due: {new Date(card.dueDate).toLocaleDateString()}</span> : null}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-1">
                        {columns.map((_, toIdx) => (
                          toIdx === colIdx ? null : (
                            <button key={toIdx} onClick={() => onMove?.(col.id, columns[toIdx].id, card.id, 0)} className="text-xs text-brand-500">Move</button>
                          )
                        ))}
                      </div>
                      <button onClick={() => onDeleteCard?.(col.id, card.id)} className="text-xs text-red-500">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {/* drop placeholder at end of column */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
