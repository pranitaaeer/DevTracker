"use client";

import React, { useState } from "react";
import { useUIStore } from "@/stores/useUIStore";
import Card from "@/components/Card";

// JSON dummy data import
import dummyData from "@/app/data/dummyResume.json";

export default function ResumePage() {
  const addToast = useUIStore((s) => s.addToast);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    role: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    summary: "",
    skillsLanguages: "",
    skillsFrontend: "",
    skillsBackend: "",
    skillsDatabase: "",
    skillsTools: "",
    skillsSoft: "",
    experiences: [
      {
        id: "1",
        role: "",
        company: "",
        year: "",
        details: "",
      },
    ],
    projects: [
      {
        id: "1",
        title: "",
        techStack: "",
        year: "",
        details: "",
      },
    ],
    certifications: "",
    education: "",
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Dynamic Fallback Helper
  const getVal = (val: string, fallback: string) => (val && val.trim() !== "" ? val : fallback);

  // Text Inputs Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Experience Handlers
  const handleExperienceChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedExp = [...formData.experiences];
    updatedExp[index] = { ...updatedExp[index], [field]: value };
    setFormData((prev) => ({ ...prev, experiences: updatedExp }));
  };

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: Date.now().toString(),
          role: "",
          company: "",
          year: "",
          details: "",
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    const updatedExp = formData.experiences.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, experiences: updatedExp }));
  };

  // Project Handlers
  const handleProjectChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData((prev) => ({ ...prev, projects: updatedProjects }));
  };

  const addProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          id: Date.now().toString(),
          title: "",
          techStack: "",
          year: "",
          details: "",
        },
      ],
    }));
  };

  const removeProject = (index: number) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, projects: updatedProjects }));
  };

  // AI Resume Generator
  const handleAIGenerate = async () => {
    setIsGenerating(true);
    addToast({ title: "AI is crafting your resume..." });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setFormData((prev) => ({
        ...prev,
        summary:
          "Results-driven Software Engineer with expertise in modern JavaScript frameworks, distributed systems, and user-centric web applications.",
      }));
      addToast({ title: "Resume enhanced with AI!" });
    } catch {
      addToast({ title: "Failed to generate resume with AI." });
    } finally {
      setIsGenerating(false);
    }
  };

  // Export PDF Handler
  const handleExportPDF = () => {
    window.print();
  };

  const handleCopyJSON = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
      addToast({ title: "Copied Resume JSON to clipboard" });
    } catch {
      addToast({ title: "Copy failed" });
    }
  };

  const activeExperiences = formData.experiences.some((e) => e.role || e.company)
    ? formData.experiences
    : dummyData.experiences;

  const activeProjects = formData.projects.some((p) => p.title || p.details)
    ? formData.projects
    : dummyData.projects;

  return (
    <>
      {/* PERFECT SINGLE PAGE FIX WITH NO EXTRA BLANK PAGE */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0; /* Unwanted margins complete disable */
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow: hidden !important; /* Forces single page when overflow is minor */
            background: #ffffff !important;
          }

          /* Hide everything on screen except resume-preview */
          body * {
            visibility: hidden !important;
          }

          #resume-preview,
          #resume-preview * {
            visibility: visible !important;
          }

          #resume-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            max-height: 297mm !important; /* Strict height limitation */
            margin: 0 !important;
            padding: 8mm 12mm !important; /* Slightly tighter padding to avoid overflow */
            box-sizing: border-box !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            overflow: hidden !important; /* Extra blank space strictly trim karega */
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .resume-section {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              AI Resume Builder
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Fill in your details, enhance with AI, and export as PDF.
            </p>
          </div>

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

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT SIDE: INPUT FORM */}
          <div className="space-y-6 max-h-[85vh] overflow-y-auto pr-2">
            
            {/* Personal Info */}
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
                    placeholder="e.g. John Doe"
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
                    placeholder="e.g. Software Engineer"
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
                    placeholder="john.doe@example.com"
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
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="linkedin.com/in/johndoe"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">GitHub URL</label>
                  <input
                    type="text"
                    name="github"
                    placeholder="github.com/johndoe"
                    value={formData.github}
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
                  placeholder="Write a brief professional overview..."
                  value={formData.summary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </Card>

            {/* Categorized Skills */}
            <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                Skills Breakdown
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Languages</label>
                <input
                  type="text"
                  name="skillsLanguages"
                  placeholder="e.g. JavaScript, Python"
                  value={formData.skillsLanguages}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Frontend</label>
                <input
                  type="text"
                  name="skillsFrontend"
                  placeholder="e.g. React.js, Tailwind CSS"
                  value={formData.skillsFrontend}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Backend</label>
                <input
                  type="text"
                  name="skillsBackend"
                  placeholder="e.g. Node.js, Express, REST APIs"
                  value={formData.skillsBackend}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Database</label>
                <input
                  type="text"
                  name="skillsDatabase"
                  placeholder="e.g. MongoDB, PostgreSQL"
                  value={formData.skillsDatabase}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Tools</label>
                <input
                  type="text"
                  name="skillsTools"
                  placeholder="e.g. Git, Docker, Postman"
                  value={formData.skillsTools}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Soft Skills</label>
                <input
                  type="text"
                  name="skillsSoft"
                  placeholder="e.g. Communication, Leadership"
                  value={formData.skillsSoft}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </Card>

            {/* Experience & Projects */}
            <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
              {/* EXPERIENCE */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Work Experience
                </h2>
                <button
                  onClick={addExperience}
                  className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium rounded hover:bg-indigo-100"
                >
                  + Add Experience
                </button>
              </div>

              {formData.experiences.map((exp, idx) => (
                <div key={exp.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Experience #{idx + 1}</span>
                    {formData.experiences.length > 1 && (
                      <button
                        onClick={() => removeExperience(idx)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Role"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                      className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                      className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Duration / Year (e.g. 2024 - Present)"
                    value={exp.year}
                    onChange={(e) => handleExperienceChange(idx, "year", e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />

                  <textarea
                    rows={3}
                    placeholder="Details (Line separated)"
                    value={exp.details}
                    onChange={(e) => handleExperienceChange(idx, "details", e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />
                </div>
              ))}

              {/* PROJECTS */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 pt-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  Projects
                </h2>
                <button
                  onClick={addProject}
                  className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium rounded hover:bg-indigo-100"
                >
                  + Add Project
                </button>
              </div>

              {formData.projects.map((proj, idx) => (
                <div key={proj.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Project #{idx + 1}</span>
                    {formData.projects.length > 1 && (
                      <button
                        onClick={() => removeProject(idx)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={proj.title}
                      onChange={(e) => handleProjectChange(idx, "title", e.target.value)}
                      className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g. 2026)"
                      value={proj.year}
                      onChange={(e) => handleProjectChange(idx, "year", e.target.value)}
                      className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Tech Stack"
                    value={proj.techStack}
                    onChange={(e) => handleProjectChange(idx, "techStack", e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />

                  <textarea
                    rows={3}
                    placeholder="Details/Bullets (Line separated)"
                    value={proj.details}
                    onChange={(e) => handleProjectChange(idx, "details", e.target.value)}
                    className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs"
                  />
                </div>
              ))}
            </Card>

            {/* Certifications & Education */}
            <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-2">
                Certifications & Education
              </h2>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Certifications (Line separated)</label>
                <textarea
                  name="certifications"
                  rows={3}
                  placeholder="e.g. AWS Certified Developer (2025)"
                  value={formData.certifications}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Education Details</label>
                <textarea
                  name="education"
                  rows={2}
                  placeholder="e.g. Degree, University, Year"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </Card>
          </div>

          {/* RIGHT SIDE: LIVE PREVIEW */}
          <div className="flex justify-center overflow-x-auto w-full">
            <div
              id="resume-preview"
              className="w-[210mm] bg-white text-black font-serif rounded-xl border border-slate-200 shadow-xl p-[10mm_15mm] text-xs leading-snug box-border"
            >
              {/* Header */}
              <div className="text-center mb-3 resume-section">
                <h1 className="text-2xl font-bold tracking-tight text-black mb-0.5">
                  {getVal(formData.fullName, dummyData.fullName)}
                </h1>
                <div className="text-sm font-bold text-black mb-1">
                  {getVal(formData.role, dummyData.role)}
                </div>
                <div className="text-[11px] text-gray-800 flex items-center justify-center flex-wrap gap-2">
                  <span>{getVal(formData.phone, dummyData.phone)}</span>
                  <span>• {getVal(formData.email, dummyData.email)}</span>
                  <span>• {getVal(formData.linkedin, dummyData.linkedin)}</span>
                  <span>• {getVal(formData.github, dummyData.github)}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-3 resume-section">
                <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 text-black tracking-wide">
                  Summary
                </h2>
                <p className="text-[11px] text-justify text-gray-900 leading-normal">
                  {getVal(formData.summary, dummyData.summary)}
                </p>
              </div>

              {/* Skills */}
              <div className="mb-3 resume-section">
                <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 text-black tracking-wide">
                  Skills
                </h2>
                <div className="text-[11px] space-y-0.5 text-gray-900">
                  <p><strong>Languages:</strong> {getVal(formData.skillsLanguages, dummyData.skillsLanguages)}</p>
                  <p><strong>Frontend:</strong> {getVal(formData.skillsFrontend, dummyData.skillsFrontend)}</p>
                  <p><strong>Backend:</strong> {getVal(formData.skillsBackend, dummyData.skillsBackend)}</p>
                  <p><strong>Database:</strong> {getVal(formData.skillsDatabase, dummyData.skillsDatabase)}</p>
                  <p><strong>Tools:</strong> {getVal(formData.skillsTools, dummyData.skillsTools)}</p>
                  <p><strong>Soft Skills:</strong> {getVal(formData.skillsSoft, dummyData.skillsSoft)}</p>
                </div>
              </div>

              {/* Experience */}
              <div className="mb-3 resume-section">
                <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 text-black tracking-wide">
                  Experience
                </h2>
                <div className="space-y-2 text-[11px] text-gray-900">
                  {activeExperiences.map((exp, i) => (
                    <div key={exp.id || i}>
                      <div className="flex justify-between font-bold">
                        <span>
                          {exp.role} {exp.company ? `— ${exp.company}` : ""}
                        </span>
                        <span>{exp.year}</span>
                      </div>
                      {exp.details && (
                        <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
                          {exp.details.split("\n").filter(Boolean).map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-3 resume-section">
                <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 text-black tracking-wide">
                  Projects
                </h2>
                <div className="space-y-2 text-[11px] text-gray-900">
                  {activeProjects.map((proj, i) => (
                    <div key={proj.id || i}>
                      <div className="flex justify-between font-bold">
                        <span>
                          {proj.title || `Project #${i + 1}`}{" "}
                          {proj.techStack ? `| ${proj.techStack}` : ""}
                        </span>
                        <span>{proj.year}</span>
                      </div>
                      {proj.details && (
                        <ul className="list-disc pl-4 space-y-0.5 mt-0.5">
                          {proj.details.split("\n").filter(Boolean).map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-3 resume-section">
                <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 text-black tracking-wide">
                  Certifications
                </h2>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-gray-900">
                  {getVal(formData.certifications, dummyData.certifications)
                    .split("\n")
                    .filter(Boolean)
                    .map((cert, i) => (
                      <li key={i}>{cert}</li>
                    ))}
                </ul>
              </div>

              {/* Education */}
              <div className="mb-3 resume-section">
                <h2 className="text-xs font-bold uppercase border-b border-black pb-0.5 mb-1 text-black tracking-wide">
                  Education
                </h2>
                <div className="text-[11px] text-gray-900">
                  <p>{getVal(formData.education, dummyData.education)}</p>
                </div>
              </div>

              <div className="text-center text-[9px] font-sans text-gray-400 pt-2 print:hidden">
                Overleaf LaTeX Format Live Preview • Exact A4 Dimensions
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}