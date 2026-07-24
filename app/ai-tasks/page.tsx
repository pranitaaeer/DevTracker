"use client";

import React, { useState } from "react";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import { useDataStore } from "@/stores/useDataStore";
import { useUIStore } from "@/stores/useUIStore";

export default function AITasksPage() {
  const [loading, setLoading] = useState(false);

  // Store Hooks
  const tasks = useDataStore((s) => s.aiTasks || []);
  const generateTask = useDataStore((s) => s.generateAITask);
  const updateStatus = useDataStore((s) => s.updateAITaskStatus);
  const addToast = useUIStore((s) => s.addToast);

  // Generate Task Handler
  async function generate() {
    setLoading(true);
    try {
      const response=await generateTask();
      console.log("response",response)
      addToast({ title: "AI task generated successfully" });
    } catch (error) {
      addToast({ title: "Failed to generate task" });
    } finally {
      setLoading(false);
    }
  }

  // Action Handlers
  async function complete(id: string) {
    await updateStatus(id, "completed");
    addToast({ title: "Marked completed" });
  }

  async function dismiss(id: string) {
    await updateStatus(id, "dismissed");
    addToast({ title: "Task dismissed" });
  }

  return (
    <main className="p-6 max-w-6xl mx-auto min-h-screen bg-white dark:bg-[#0d1117] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Suggestions and automation helpers</p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-medium rounded-lg shadow-sm transition-all flex items-center gap-2"
        >
          {loading ? "Generating..." : "Generate AI Task"}
        </button>
      </div>

      <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        {tasks.length === 0 ? (
          <EmptyState
            title="No AI suggestions"
            description="Click the button above to surface new AI task suggestions."
            action={
              <button
                onClick={generate}
                disabled={loading}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-600 transition"
              >
                {loading ? "Generating..." : "Generate AI Task"}
              </button>
            }
          />
        ) : (
          <ul className="space-y-3">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 flex items-center justify-between gap-4 transition"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{t.title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{t.details}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {t.status === "pending" && (
                    <>
                      <button
                        onClick={() => complete(t.id)}
                        className="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-md transition"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => dismiss(t.id)}
                        className="px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition"
                      >
                        Dismiss
                      </button>
                    </>
                  )}

                  {t.status === "completed" && (
                    <span className="px-2.5 py-1 text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 rounded-full">
                      Completed
                    </span>
                  )}

                  {t.status === "dismissed" && (
                    <span className="px-2.5 py-1 text-xs font-medium text-rose-500 bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400 rounded-full">
                      Dismissed
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </main>
  );
}