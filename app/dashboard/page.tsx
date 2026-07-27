'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUser } from '@clerk/nextjs';
import { useDataStore } from '@/stores/useDataStore';
import ProjectsList from '@/components/ProjectsList';
import JournalList from '@/components/JournalList';
import AchievementsList from '@/components/AchievementsList';
import Card from '@/components/Card';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import AnimatedNumber from '@/components/AnimatedNumber';
import { Plus, Sparkles, Flame, Activity, Code2, FolderGit2, Send } from 'lucide-react';
import { fetchActivitiesForUser } from "@/lib/supabase/supabase-activities";
import Link from 'next/link';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  message: string;
};

const AnalyticsChart = dynamic(
  () => import('@/components/AnalyticsChart'),
  {
    ssr: false,
    loading: () => <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse" />
  }
);

const Heatmap = dynamic(
  () => import('@/components/Heatmap'),
  {
    ssr: false,
    loading: () => <div className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-900 animate-pulse" />
  }
);

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const activities = useDataStore(s => s.activities);
  const projects = useDataStore(s => s.projects);
  const journal = useDataStore(s => s.journal);
  const interviews = useDataStore(s => s.interviews);
  const achievements = useDataStore(s => s.achievements);
  const aiTasks = useDataStore(s => s.aiTasks);

  // AI Drawer Control State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [contributions, setContributions] = useState<any>({});
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // FIX 1: Initialized messages state properly
  const [messages, setMessages] = useState<Message[]>([]);

  // Simple Normal Handle Send Function
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    // User message local state mein add karein
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      message: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Dummy AI Response (1 second ke delay ke baad)
    setTimeout(() => {
      const dummyReplies = [
        "That's awesome! Keep pushing your code updates.",
        "Got it! I've logged this in your local session.",
        "Great progress! Let me know if you need help structuring your tasks.",
        "Keep going! Consistency is key to mastering development."
      ];

      const randomReply = dummyReplies[Math.floor(Math.random() * dummyReplies.length)];

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        message: randomReply,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    async function load() {
      if (!user?.id) return;

      const data = await fetchActivitiesForUser(user.id);
      const map: any = {};

      data?.forEach((activity: any) => {
        const date = activity.occurredAt.split("T")[0];
        map[date] = (map[date] || 0) + 1;
      });

      setContributions(map);
    }

    if (isLoaded && isSignedIn) {
      load();
    }
  }, [user, isLoaded, isSignedIn]);

  const weekly = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const map: Record<string, number> = {};

    days.forEach(day => map[day] = 0);

    activities.forEach(a => {
      const d = new Date(a.createdAt);
      map[days[d.getDay()]] += (a.durationMin || 0) / 60;
    });

    return days.map(day => ({
      day,
      hours: Math.round(map[day] * 10) / 10
    }));
  }, [activities]);

  const todayActivities = useMemo(
    () => activities.slice(0, 3),
    [activities]
  );

  const totalHours = Math.round(
    activities.reduce((s, a) => s + (a.durationMin || 0), 0) / 60 * 10
  ) / 10;

  if (!isLoaded) {
    return <div className="p-8"><LoadingSkeleton className="h-96" /></div>;
  }

  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-[#0d1117] text-black dark:text-white p-6 relative">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] p-8 mb-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />

        <div className="relative flex flex-col xl:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <Activity size={16} className="text-emerald-400" />
              Developer Dashboard
            </div>

            <h1 className="mt-4 text-5xl font-bold tracking-tight bg-gradient-to-r from-black dark:from-white via-zinc-600 dark:via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              DevTrack
            </h1>

            <p className="mt-3 max-w-lg text-zinc-600 dark:text-zinc-400">
              Your personal developer operating system to track coding progress, projects, achievements and growth.
            </p>

            <div className="flex gap-3 mt-7">
              <Link href={'/analytics'}>
                <button className="flex items-center gap-2 rounded-xl bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 text-sm font-semibold transition hover:scale-105">
                  <Plus size={17} />
                  Add Activity
                </button>
              </Link>

              {/* AI Assistant Trigger Button */}
              <button
                onClick={() => setIsAiOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-[#0d1117] text-black dark:text-white px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <Sparkles size={17} className="text-purple-500" />
                AI Assistant
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-start">
            <StatCard
              icon={<Code2 size={18} />}
              title="Coding Hours"
              value={<AnimatedNumber value={totalHours} />}
            />
            <StatCard
              icon={<FolderGit2 size={18} />}
              title="Projects"
              value={projects.length}
            />
            <StatCard
              icon={<Activity size={18} />}
              title="Activities"
              value={activities.length}
            />
          </div>
        </div>
      </section>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card title="Today's Progress">
            {todayActivities.length === 0 ? (
              <LoadingSkeleton className="h-32" />
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                {todayActivities.map(a => (
                  <div key={a.id} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111827] p-5">
                    <p className="text-sm font-medium text-black dark:text-zinc-100">
                      {a.title}
                    </p>
                    <span className="text-xs text-zinc-500">
                      {a.durationMin}m
                    </span>
                    <p className="text-xs text-zinc-500 mt-4">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Projects">
            <ProjectsList projects={projects} />
          </Card>

          <Card title="Developer Journal">
            <JournalList entries={journal} />
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="GitHub Contribution">
            <Heatmap contributions={contributions} />
          </Card>

          <Card title="Weekly Coding Hours">
            <AnalyticsChart data={weekly} />
          </Card>
        </aside>
      </div>

      <section className="mt-6 grid lg:grid-cols-3 gap-6">
        <Card title="Interview Pipeline">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Flame className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{interviews.length}</h2>
              <p className="text-sm text-zinc-500">Upcoming interviews</p>
            </div>
          </div>
        </Card>

        <Card title="Achievements">
          <AchievementsList items={achievements} />
        </Card>

        <Card title="AI Tasks">
          <div className="space-y-3">
            {aiTasks.map(t => (
              <div key={t.id} className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111827] px-4 py-3 text-sm text-black dark:text-zinc-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {t.title}
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* AI Assistant Modal/Drawer */}
      {isAiOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md h-full bg-white dark:bg-[#111827] border-l border-zinc-200 dark:border-zinc-800 p-6 flex flex-col justify-between shadow-2xl transition-all">
            <div className="flex flex-col h-full overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
                <div className="flex items-center gap-2 font-semibold text-lg text-zinc-900 dark:text-white">
                  <Sparkles className="text-purple-500" size={20} />
                  DevTrack AI Assistant
                </div>
                <button
                  onClick={() => setIsAiOpen(false)}
                  className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white text-sm cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              {/* Chat Container */}
              <div className="flex-1 overflow-y-auto my-4 space-y-4 text-sm text-zinc-600 dark:text-zinc-400 pr-1">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-300">
                  👋 Hi! I analyzed your recent activities. You spent <strong>{totalHours} hrs</strong> coding recently. Ready to set today's goals?
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-zinc-400">Quick Prompts</p>
                  <button 
                    onClick={() => handleSendMessage("Summarize my weekly progress")}
                    className="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    ✨ Summarize my weekly progress
                  </button>
                  <button 
                    onClick={() => handleSendMessage("Suggest tasks to keep my streak going")}
                    className="w-full text-left p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                  >
                    🔥 Suggest tasks to keep my streak going
                  </button>
                </div>

                {/* FIX 2: Render Sent Messages */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'ml-auto bg-purple-600 text-white max-w-[85%]'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 max-w-[85%]'
                    }`}
                  >
                    {msg.message}
                  </div>
                ))}

                {isTyping && (
                  <div className="text-xs text-purple-400 italic animate-pulse">
                    AI is thinking...
                  </div>
                )}
              </div>

              {/* Input Container */}
              <div className="relative flex items-center shrink-0">
                <input
                  type="text"
                  placeholder="Ask AI anything about your code journey..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="w-full px-4 py-3 pr-12 text-sm rounded-xl bg-slate-900 border border-purple-500/30 focus:outline-none focus:border-purple-500 text-white"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim()}
                  className="absolute right-2 p-2 rounded-lg text-purple-400 hover:text-white hover:bg-purple-600/20 disabled:opacity-40 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  icon
}: {
  title: string;
  value: any;
  icon: React.ReactNode;
}) {
  return (
    <div className="min-w-[150px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111827] px-5 py-4 shadow-lg">
      <div className="flex items-center gap-2 text-zinc-500 text-xs">
        {icon}
        {title}
      </div>
      <div className="mt-3 text-3xl font-bold text-black dark:text-white">
        {value}
      </div>
    </div>
  );
}