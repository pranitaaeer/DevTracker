"use client";

import React, { useState } from 'react';
import Card from '@/components/Card';
import { useUIStore } from '@/stores/useUIStore';
import { 
  User, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  ShieldCheck, 
  LogOut, 
  Trash2, 
  Download,
  Mail,
  Lock,
  Sparkles,
  Bot,
  Info,
  Github,
  Shield
} from 'lucide-react';

export default function SettingsPage() {
  const addToast = useUIStore((s) => s.addToast);
  
  // Local state for theme management
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    email: true,
    securityAlerts: true,
    updates: false,
  });

  // Local state for AI Preferences
  const [aiPreferences, setAiPreferences] = useState({
    suggestions: true,
    autoGenerateTasks: false,
    preferredModel: 'gpt-4o',
  });

  // Action Handlers
  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      addToast({ title: 'Logged out successfully' });
    }
  };

  const handleExportData = () => {
    addToast({ title: 'Downloading your data...' });
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    addToast({ title: 'Notification preferences updated' });
  };

  const toggleAiPreference = (key: 'suggestions' | 'autoGenerateTasks') => {
    setAiPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    addToast({ title: 'AI settings updated' });
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAiPreferences((prev) => ({ ...prev, preferredModel: e.target.value }));
    addToast({ title: `AI model updated to ${e.target.value}` });
  };

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences, appearance, and security settings.
        </p>
      </div>

      {/* 1. PROFILE SECTION */}
      <Card title="Profile Information">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow">
              DT
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Dev Track User</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">dev@devtrack.local</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full">
                Developer Plan
              </span>
            </div>
          </div>
          <button className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            Edit Profile
          </button>
        </div>
      </Card>

      {/* 2. THEME & APPEARANCE */}
      <Card title="Appearance">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Customize how DevTrack looks on your device.
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium gap-2 transition ${
              theme === 'light'
                ? 'border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Sun className="w-5 h-5" />
            Light
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium gap-2 transition ${
              theme === 'dark'
                ? 'border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Moon className="w-5 h-5" />
            Dark
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-medium gap-2 transition ${
              theme === 'system'
                ? 'border-blue-600 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Monitor className="w-5 h-5" />
            System
          </button>
        </div>
      </Card>

      {/* 3. AI PREFERENCES */}
      <Card title="AI Preferences">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">AI Suggestions</div>
                <div className="text-xs text-slate-500">Enable smart recommendations while coding or planning.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={aiPreferences.suggestions}
              onChange={() => toggleAiPreference('suggestions')}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Auto Generate Tasks</div>
                <div className="text-xs text-slate-500">Automatically turn AI suggestions into actionable tasks.</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={aiPreferences.autoGenerateTasks}
              onChange={() => toggleAiPreference('autoGenerateTasks')}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Preferred AI Model</div>
              <div className="text-xs text-slate-500">Select which model powers your workspace assistant.</div>
            </div>
            <select
              value={aiPreferences.preferredModel}
              onChange={handleModelChange}
              className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
              <option value="gemini-1-5-pro">Gemini 1.5 Pro</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 4. NOTIFICATIONS */}
      <Card title="Notifications">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Email Notifications</div>
              <div className="text-xs text-slate-500">Receive weekly activity summaries via email.</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.email}
              onChange={() => toggleNotification('email')}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Security Alerts</div>
              <div className="text-xs text-slate-500">Get instantly notified for unusual login attempts.</div>
            </div>
            <input
              type="checkbox"
              checked={notifications.securityAlerts}
              onChange={() => toggleNotification('securityAlerts')}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </Card>

      {/* 5. SECURITY & DATA */}
      <Card title="Security & Data">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Password</div>
                <div className="text-xs text-slate-500">Change your password anytime.</div>
              </div>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:underline">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Export Personal Data</div>
                <div className="text-xs text-slate-500">Download a copy of all your tracked data.</div>
              </div>
            </div>
            <button onClick={handleExportData} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:underline">
              Export
            </button>
          </div>
        </div>
      </Card>

      {/* 6. ABOUT */}
      <Card title="About">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Version</div>
                <div className="text-xs text-slate-500">DevTrack v1.2.0-beta</div>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded">
              Up to date
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Github className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">GitHub</div>
                <div className="text-xs text-slate-500">View source code and report issues.</div>
              </div>
            </div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Repository
            </a>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-slate-500" />
              <div>
                <div className="text-sm font-medium text-slate-800 dark:text-slate-200">Privacy Policy</div>
                <div className="text-xs text-slate-500">Read our terms and data collection rules.</div>
              </div>
            </div>
            <a 
              href="#" 
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Read
            </a>
          </div>
        </div>
      </Card>

      {/* 7. ACCOUNT ACTIONS (Logout & Danger Zone) */}
      <Card title="Account Actions">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            Log Out
          </button>

          <button
            onClick={() => alert('Account deletion requested')}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
        </div>
      </Card>
    </main>
  );
}