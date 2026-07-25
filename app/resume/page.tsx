"use client";

import React, { useState } from "react";
import { useUIStore } from "@/stores/useUIStore";
import Card from "@/components/Card";

export default function ResumePage() {
  const addToast = useUIStore((s) => s.addToast);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    role: "Full Stack Developer",
    summary:
      "Passionate software engineer with 3+ years of experience building scalable web applications.",
    skills: "React, Next.js, TypeScript, Node.js, Tailwind CSS",
    experience: "Software Engineer at TechCorp (2022 - Present)\n- Built responsive UI components\n- Improved page load performance by 40%",
    education: "B.S. in Computer Science - Tech University (2018 - 2022)",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // AI Resume Generator Function
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    addToast({ title: "AI is crafting your resume..." });

    try {
      // TODO: Replace with your actual AI API call (e.g., OpenAI / Gemini API)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setFormData((prev) => ({
        ...prev,
        summary:
          "Results-driven Full Stack Developer specializing in high-performance web applications, modern React ecosystems, and seamless user experiences.",
        skills: "React, Next.js, TypeScript, Tailwind CSS, Node.js, GraphQL, PostgreSQL",
      }));

      addToast({ title: "Resume enhanced with AI!" });
    } catch (error) {
      addToast({ title: "Failed to generate resume with AI." });
    } finally {
      setIsGenerating(false);
    }
  };

  // Export to PDF (Using Browser Print Engine)
  const handleExportPDF = () => {
    window.print();
    addToast({ title: "Opening print/save to PDF dialog" });
  };

  // Copy JSON Data
  const handleCopyJSON = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
      addToast({ title: "Copied Resume JSON to clipboard" });
    } catch {
      addToast({ title: "Copy failed" });
    }
  };

  return (
    <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 print:p-0 print:max-w-none">
      {/* Header - Hidden in Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            AI Resume Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Fill in your details, enhance with AI, and export as PDF.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleAIGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow transition-all disabled:opacity-50"
          >
            <span>{isGenerating ? "Magic in progress..." : "✨ Enhance with AI"}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium rounded-lg shadow transition-all"
          >
            📥 Download PDF
          </button>

          <button
            onClick={handleCopyJSON}
            className="px-3 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300 text-sm transition-all"
          >
            Copy JSON
          </button>
        </div>
      </div>

      {/* Main Grid: Form Input (Left) & Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
        
        {/* INPUT FORM SECTION (Hidden when printing) */}
        <div className="space-y-6 print:hidden">
          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Target Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Professional Summary</label>
              <textarea
                name="summary"
                rows={3}
                value={formData.summary}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
              Details & Experience
            </h2>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Skills (Comma Separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Experience</label>
              <textarea
                name="experience"
                rows={4}
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Education</label>
              <textarea
                name="education"
                rows={2}
                value={formData.education}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </Card>
        </div>

        {/* LIVE RESUME PREVIEW SECTION (Print Friendly) */}
        <div className="p-8 bg-white text-slate-900 rounded-xl border border-slate-200 shadow-md print:shadow-none print:border-none print:p-0 min-h-[600px] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="border-b border-slate-200 pb-4 mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {formData.fullName || "Your Name"}
              </h1>
              <p className="text-lg font-medium text-indigo-600 mt-1">
                {formData.role || "Your Target Role"}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500 mt-2">
                <span>{formData.email}</span>
                {formData.phone && <span>• {formData.phone}</span>}
              </div>
            </div>

            {/* Summary */}
            {formData.summary && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Summary
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {formData.summary}
                </p>
              </div>
            )}

            {/* Skills */}
            {formData.skills && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {formData.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded print:border print:border-slate-200"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {formData.experience && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Experience
                </h3>
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {formData.experience}
                </p>
              </div>
            )}

            {/* Education */}
            {formData.education && (
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Education
                </h3>
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {formData.education}
                </p>
              </div>
            )}
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-6 border-t border-slate-100 print:hidden">
            Live Preview • Ready for PDF Export
          </div>
        </div>

      </div>
    </main>
  );
}