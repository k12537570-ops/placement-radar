import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Layout,
  BookOpen,
  Upload,
  Target,
  CheckCircle2,
  Send
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { analyzeResumeATS, checkBullet, ACTION_VERBS, WEAK_VERBS } from '../data/resumeTemplates';
import { ROLES } from '../data/roles';
import { useAppStore } from '../store/useAppStore';
import { useToastStore } from '../store/useToastStore';
import api from '../services/api';

export default function ResumePage() {
  const [activeTab, setActiveTab] = useState('personal'); // personal, summary, experience, projects, skills, edu, certs, job-match
  const [template, setTemplate] = useState('classic'); // 'classic' | 'modern' | 'minimal'
  const resumePrintRef = useRef(null);
  const fileUploadRef = useRef(null);

  // Job Matcher State
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [jobCompanyInput, setJobCompanyInput] = useState('');
  const [jobTextInput, setJobTextInput] = useState('');
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [jobMatchData, setJobMatchData] = useState(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const { resume, updateResume, syncSkillsToResume, targetRole } = useAppStore();
  const { addToast } = useToastStore();

  const currentRole = ROLES.find((r) => r.id === targetRole) || ROLES[0];

  // Run rule-based ATS analysis
  const atsAnalysis = useMemo(() => {
    return analyzeResumeATS(resume, targetRole);
  }, [resume, targetRole]);

  // Handle PDF/Text Resume Upload & Extraction
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingFile(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = event.target.result;
        try {
          const res = await api.post('/resume/parse-text', { rawText: text });
          if (res.data?.success && res.data?.data?.extracted) {
            const ext = res.data.data.extracted;
            const updated = {
              ...resume,
              personal: {
                ...resume.personal,
                ...(ext.email && { email: ext.email }),
                ...(ext.phone && { phone: ext.phone }),
                ...(ext.github && { github: ext.github }),
                ...(ext.linkedin && { linkedin: ext.linkedin })
              },
              skills: Array.from(new Set([...(resume.skills || []), ...(ext.skills || [])]))
            };
            updateResume(updated);
            addToast(`Resume text parsed! Merged ${ext.skills.length} skills and contact links.`, 'success');
          }
        } catch (apiErr) {
          addToast('File read successfully. Check the editor fields.', 'info');
        } finally {
          setIsUploadingFile(false);
        }
      };
      reader.readAsText(file);
    } catch (err) {
      addToast('Failed to parse file.', 'error');
      setIsUploadingFile(false);
    }
    e.target.value = '';
  };

  // Handle Job Description Match Analysis
  const handleAnalyzeJobMatch = async () => {
    if (!jobTextInput.trim()) {
      addToast('Please paste a job description first.', 'error');
      return;
    }

    setIsAnalyzingJob(true);
    try {
      const res = await api.post('/resume/job-match', {
        jobTitle: jobTitleInput || currentRole.title,
        company: jobCompanyInput || '',
        jobText: jobTextInput,
        resume
      });

      if (res.data?.success && res.data?.data) {
        setJobMatchData(res.data.data);
        addToast(`Job alignment calculated: ${res.data.data.matchScore}% match!`, 'success');
      }
    } catch (err) {
      addToast('Failed to analyze job match.', 'error');
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  // One-click add missing keywords to resume
  const handleAddMissingKeywords = () => {
    if (!jobMatchData?.missingKeywords || jobMatchData.missingKeywords.length === 0) return;
    const missingFormatted = jobMatchData.missingKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1));
    const merged = Array.from(new Set([...(resume.skills || []), ...missingFormatted]));
    updateResume({ ...resume, skills: merged });
    addToast(`Added ${missingFormatted.length} missing keywords to your resume skills!`, 'success');
  };

  // Sync skills from calibrated store
  const handleSyncSkills = async () => {
    await syncSkillsToResume();
    addToast('Skills rated level 3+ synchronized to your resume!', 'success');
  };

  // Helper for updating nested resume data
  const handlePersonalChange = (field, val) => {
    updateResume({
      ...resume,
      personal: {
        ...resume.personal,
        [field]: val
      }
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer Intern',
      company: 'Tech Corp',
      period: 'May 2024 — Jul 2024',
      location: 'Bangalore',
      bullets: ['Engineered scalable features using React and Node.js.']
    };
    updateResume({
      ...resume,
      experience: [...(resume.experience || []), newExp]
    });
  };

  const handleRemoveExperience = (index) => {
    const updated = [...(resume.experience || [])];
    updated.splice(index, 1);
    updateResume({ ...resume, experience: updated });
  };

  const handleUpdateExperience = (index, field, val) => {
    const updated = [...(resume.experience || [])];
    updated[index] = { ...updated[index], [field]: val };
    updateResume({ ...resume, experience: updated });
  };

  const handleAddExpBullet = (expIndex) => {
    const updated = [...(resume.experience || [])];
    updated[expIndex].bullets = [...(updated[expIndex].bullets || []), ''];
    updateResume({ ...resume, experience: updated });
  };

  const handleUpdateExpBullet = (expIndex, bulletIndex, text) => {
    const updated = [...(resume.experience || [])];
    updated[expIndex].bullets[bulletIndex] = text;
    updateResume({ ...resume, experience: updated });
  };

  const handleRemoveExpBullet = (expIndex, bulletIndex) => {
    const updated = [...(resume.experience || [])];
    updated[expIndex].bullets.splice(bulletIndex, 1);
    updateResume({ ...resume, experience: updated });
  };

  // Project handlers
  const handleAddProject = () => {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: 'New Web Project',
      tech: 'React, Node.js, SQL',
      link: 'github.com/username/project',
      bullets: ['Architected key components delivering 30% performance boost.']
    };
    updateResume({
      ...resume,
      projects: [...(resume.projects || []), newProj]
    });
  };

  const handleRemoveProject = (index) => {
    const updated = [...(resume.projects || [])];
    updated.splice(index, 1);
    updateResume({ ...resume, projects: updated });
  };

  const handleUpdateProject = (index, field, val) => {
    const updated = [...(resume.projects || [])];
    updated[index] = { ...updated[index], [field]: val };
    updateResume({ ...resume, projects: updated });
  };

  const handleAddProjBullet = (projIndex) => {
    const updated = [...(resume.projects || [])];
    updated[projIndex].bullets = [...(updated[projIndex].bullets || []), ''];
    updateResume({ ...resume, projects: updated });
  };

  const handleUpdateProjBullet = (projIndex, bulletIndex, text) => {
    const updated = [...(resume.projects || [])];
    updated[projIndex].bullets[bulletIndex] = text;
    updateResume({ ...resume, projects: updated });
  };

  const handleRemoveProjBullet = (projIndex, bulletIndex) => {
    const updated = [...(resume.projects || [])];
    updated[projIndex].bullets.splice(bulletIndex, 1);
    updateResume({ ...resume, projects: updated });
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}`,
      institution: 'University Name',
      degree: 'B.Tech in Computer Science',
      score: '8.5 CGPA',
      period: '2022 — 2026',
      location: 'City'
    };
    updateResume({
      ...resume,
      education: [...(resume.education || []), newEdu]
    });
  };

  const handleRemoveEducation = (index) => {
    const updated = [...(resume.education || [])];
    updated.splice(index, 1);
    updateResume({ ...resume, education: updated });
  };

  const handleUpdateEducation = (index, field, val) => {
    const updated = [...(resume.education || [])];
    updated[index] = { ...updated[index], [field]: val };
    updateResume({ ...resume, education: updated });
  };

  // Skills tag handlers
  const [newSkillInput, setNewSkillInput] = useState('');
  const handleAddSkillTag = () => {
    if (!newSkillInput.trim()) return;
    const current = resume.skills || [];
    if (!current.includes(newSkillInput.trim())) {
      updateResume({ ...resume, skills: [...current, newSkillInput.trim()] });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkillTag = (skillName) => {
    const filtered = (resume.skills || []).filter((s) => s !== skillName);
    updateResume({ ...resume, skills: filtered });
  };

  // Trigger print / save PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="no-print">
        <PageHeader
          stepLabel="RESUME BUILDER"
          title="ATS-Friendly Resume Studio"
          subtitle={`Generate an algorithm-optimized resume for ${currentRole.title}. Live ATS score checker, bullet point improver, and instant A4 preview.`}
          handwrittenNote="format for algorithms & humans!"
          actions={
            <div className="flex items-center gap-3">
              <input
                ref={fileUploadRef}
                type="file"
                accept=".pdf,.txt,.docx"
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                disabled={isUploadingFile}
                onClick={() => fileUploadRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium text-text hover:bg-bg-hover transition-colors"
                title="Upload PDF or text file to extract credentials and skills"
              >
                <Upload className="w-3.5 h-3.5 text-accent" />
                <span>{isUploadingFile ? 'Extracting...' : 'Upload PDF / Text'}</span>
              </button>

              <button
                onClick={handleSyncSkills}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium text-text hover:bg-bg-hover transition-colors"
                title="Auto-fill skills rated 3+ from Step 1"
              >
                <RefreshCw className="w-3.5 h-3.5 text-accent" />
                <span>Sync Calibrated Skills</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover shadow-sm active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download / Print PDF</span>
              </button>
            </div>
          }
        />
      </div>

      {/* ATS Score Card & Tips (Top Banner) */}
      <div className="no-print mb-8 p-5 rounded-card bg-bg-card border border-border shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="6" className="text-border" fill="transparent" />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke={atsAnalysis.score >= 80 ? '#10B981' : atsAnalysis.score >= 60 ? '#3B82F6' : '#F59E0B'}
                strokeWidth="6"
                strokeDasharray={201}
                strokeDashoffset={201 - (atsAnalysis.score / 100) * 201}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-lg font-bold text-text">
                {atsAnalysis.score}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-text">
                ATS Compatibility Score
              </h3>
              <span
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  atsAnalysis.score >= 80
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : atsAnalysis.score >= 60
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                }`}
              >
                {atsAnalysis.score >= 80 ? 'ATS-Optimized' : atsAnalysis.score >= 60 ? 'Good Match' : 'Needs Polish'}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Targeting: <strong className="text-text">{currentRole.title}</strong> keywords and bullet metric standards.
            </p>
          </div>
        </div>

        {/* Actionable Tips */}
        {atsAnalysis.tips.length > 0 && (
          <div className="flex-1 md:max-w-md bg-bg-secondary p-3 rounded-xl border border-border/60 text-xs">
            <div className="font-semibold text-text mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>ATS Improvement Tip:</span>
            </div>
            <p className="text-text-muted text-[11px] leading-relaxed">
              {atsAnalysis.tips[0]}
            </p>
          </div>
        )}
      </div>

      {/* Main Split: Left Form Editor vs Right Live A4 Sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form Editor (5 cols) */}
        <div className="no-print lg:col-span-5 space-y-4">
          {/* Template Selector Bar */}
          <div className="p-4 rounded-card bg-bg-card border border-border shadow-xs">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Select Resume Layout Template:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'classic', name: 'Classic Serif' },
                { id: 'modern', name: 'Modern Tech' },
                { id: 'minimal', name: 'Minimalist' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                    template === t.id
                      ? 'border-accent bg-accent-light text-accent font-semibold shadow-xs'
                      : 'border-border bg-bg text-text-muted hover:text-text'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'summary', label: 'Summary' },
              { id: 'skills', label: 'Skills' },
              { id: 'experience', label: 'Experience' },
              { id: 'projects', label: 'Projects' },
              { id: 'education', label: 'Education' },
              { id: 'job-match', label: '🎯 Job Matcher' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent text-accent-contrast font-semibold shadow-xs'
                    : 'bg-bg-card border border-border text-text-muted hover:text-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Section Forms */}
          <div className="p-5 rounded-card bg-bg-card border border-border shadow-card space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-text">Contact & Header Information</h4>
                <div>
                  <label className="text-[11px] font-semibold text-text-muted">Full Name</label>
                  <input
                    type="text"
                    value={resume.personal?.fullName || ''}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg text-text"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-text-muted">Professional Title</label>
                  <input
                    type="text"
                    value={resume.personal?.title || ''}
                    onChange={(e) => handlePersonalChange('title', e.target.value)}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg text-text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted">Email</label>
                    <input
                      type="email"
                      value={resume.personal?.email || ''}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg text-text"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted">Phone</label>
                    <input
                      type="text"
                      value={resume.personal?.phone || ''}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg text-text"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-text-muted">Location</label>
                  <input
                    type="text"
                    value={resume.personal?.location || ''}
                    onChange={(e) => handlePersonalChange('location', e.target.value)}
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg text-text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={resume.personal?.linkedin || ''}
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg text-text"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-text-muted">GitHub Profile</label>
                    <input
                      type="text"
                      value={resume.personal?.github || ''}
                      onChange={(e) => handlePersonalChange('github', e.target.value)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border border-border bg-bg text-text"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-sm text-text">Professional Summary</h4>
                <p className="text-xs text-text-muted">
                  Keep it between 30 and 60 words. Highlight your primary language, core framework, and career objective.
                </p>
                <textarea
                  rows={5}
                  value={resume.personal?.summary || ''}
                  onChange={(e) => handlePersonalChange('summary', e.target.value)}
                  className="w-full p-2.5 text-xs rounded-lg border border-border bg-bg text-text leading-relaxed"
                />
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-text">Technical Skills List</h4>
                  <button
                    onClick={handleSyncSkills}
                    className="text-xs text-accent font-medium hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync from Step 1</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkillTag()}
                    placeholder="Add skill (e.g. Docker, Redis, Tailwind)..."
                    className="flex-1 p-2 text-xs rounded-lg border border-border bg-bg text-text"
                  />
                  <button
                    onClick={handleAddSkillTag}
                    className="px-3 py-1.5 rounded-lg bg-accent text-accent-contrast text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(resume.skills || []).map((skillName) => (
                    <span
                      key={skillName}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-bg-secondary border border-border text-text"
                    >
                      <span>{skillName}</span>
                      <button
                        onClick={() => handleRemoveSkillTag(skillName)}
                        className="text-text-subtle hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-text">Experience & Internships</h4>
                  <button
                    onClick={handleAddExperience}
                    className="flex items-center gap-1 text-xs text-accent font-semibold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Role</span>
                  </button>
                </div>

                {(resume.experience || []).map((exp, eIdx) => (
                  <div key={exp.id || eIdx} className="p-3.5 rounded-xl bg-bg border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text">Experience #{eIdx + 1}</span>
                      <button
                        onClick={() => handleRemoveExperience(eIdx)}
                        className="text-text-subtle hover:text-red-600"
                        title="Remove experience"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.role}
                        placeholder="Job Title / Role"
                        onChange={(e) => handleUpdateExperience(eIdx, 'role', e.target.value)}
                        className="p-1.5 text-xs rounded border border-border bg-bg-card"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        placeholder="Company Name"
                        onChange={(e) => handleUpdateExperience(eIdx, 'company', e.target.value)}
                        className="p-1.5 text-xs rounded border border-border bg-bg-card"
                      />
                      <input
                        type="text"
                        value={exp.period}
                        placeholder="e.g. Jun 2024 — Aug 2024"
                        onChange={(e) => handleUpdateExperience(eIdx, 'period', e.target.value)}
                        className="p-1.5 text-xs rounded border border-border bg-bg-card"
                      />
                      <input
                        type="text"
                        value={exp.location}
                        placeholder="Location / Remote"
                        onChange={(e) => handleUpdateExperience(eIdx, 'location', e.target.value)}
                        className="p-1.5 text-xs rounded border border-border bg-bg-card"
                      />
                    </div>

                    {/* Bullet Points with Bullet Improver */}
                    <div className="space-y-2 pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between text-[11px] text-text-subtle font-mono">
                        <span>Action Bullets:</span>
                        <button
                          onClick={() => handleAddExpBullet(eIdx)}
                          className="text-accent hover:underline flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      {(exp.bullets || []).map((bullet, bIdx) => {
                        const check = checkBullet(bullet);
                        return (
                          <div key={bIdx} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => handleUpdateExpBullet(eIdx, bIdx, e.target.value)}
                                placeholder="Architected..."
                                className="flex-1 p-1.5 text-xs rounded border border-border bg-bg-card"
                              />
                              <button
                                onClick={() => handleRemoveExpBullet(eIdx, bIdx)}
                                className="text-text-subtle hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>

                            {/* UNIQUE: Live Bullet Improver Suggestions */}
                            {check.hasWeak && (
                              <div className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded flex items-center gap-1.5">
                                <span>⚠️ Weak phrase detected: "{check.suggestions[0]?.weak}". Try:</span>
                                <strong>{check.suggestions[0]?.better}</strong>
                              </div>
                            )}
                            {!check.hasMetric && bullet.length > 20 && (
                              <div className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950/40 p-1 rounded">
                                💡 Tip: Add numbers! (e.g. "by 35%", "reducing latency to 120ms")
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-text">Key Projects</h4>
                  <button
                    onClick={handleAddProject}
                    className="flex items-center gap-1 text-xs text-accent font-semibold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {(resume.projects || []).map((proj, pIdx) => (
                  <div key={proj.id || pIdx} className="p-3.5 rounded-xl bg-bg border border-border space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text">Project #{pIdx + 1}</span>
                      <button
                        onClick={() => handleRemoveProject(pIdx)}
                        className="text-text-subtle hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={proj.title}
                        placeholder="Project Title"
                        onChange={(e) => handleUpdateProject(pIdx, 'title', e.target.value)}
                        className="w-full p-1.5 text-xs rounded border border-border bg-bg-card font-semibold"
                      />
                      <input
                        type="text"
                        value={proj.tech}
                        placeholder="Technologies (e.g. React, Docker, PostgreSQL)"
                        onChange={(e) => handleUpdateProject(pIdx, 'tech', e.target.value)}
                        className="w-full p-1.5 text-xs rounded border border-border bg-bg-card"
                      />
                      <input
                        type="text"
                        value={proj.link}
                        placeholder="GitHub / Live Demo Link"
                        onChange={(e) => handleUpdateProject(pIdx, 'link', e.target.value)}
                        className="w-full p-1.5 text-xs rounded border border-border bg-bg-card"
                      />
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border/50">
                      <div className="flex items-center justify-between text-[11px] text-text-subtle font-mono">
                        <span>Project Bullets:</span>
                        <button
                          onClick={() => handleAddProjBullet(pIdx)}
                          className="text-accent hover:underline flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" /> Add Bullet
                        </button>
                      </div>

                      {(proj.bullets || []).map((bullet, bIdx) => {
                        const check = checkBullet(bullet);
                        return (
                          <div key={bIdx} className="space-y-1">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => handleUpdateProjBullet(pIdx, bIdx, e.target.value)}
                                placeholder="Engineered..."
                                className="flex-1 p-1.5 text-xs rounded border border-border bg-bg-card"
                              />
                              <button
                                onClick={() => handleRemoveProjBullet(pIdx, bIdx)}
                                className="text-text-subtle hover:text-red-500"
                              >
                                ×
                              </button>
                            </div>

                            {check.hasWeak && (
                              <div className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/40 p-1.5 rounded flex items-center gap-1.5">
                                <span>⚠️ Weak word: "{check.suggestions[0]?.weak}". Try:</span>
                                <strong>{check.suggestions[0]?.better}</strong>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-text">Education</h4>
                  <button
                    onClick={handleAddEducation}
                    className="flex items-center gap-1 text-xs text-accent font-semibold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Degree</span>
                  </button>
                </div>

                {(resume.education || []).map((edu, idx) => (
                  <div key={edu.id || idx} className="p-3 rounded-xl bg-bg border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text">Education #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveEducation(idx)}
                        className="text-text-subtle hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={edu.institution}
                      placeholder="College / University Name"
                      onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                      className="w-full p-1.5 text-xs rounded border border-border bg-bg-card"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      placeholder="Degree & Specialization"
                      onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                      className="w-full p-1.5 text-xs rounded border border-border bg-bg-card"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.score}
                        placeholder="CGPA / Percentage"
                        onChange={(e) => handleUpdateEducation(idx, 'score', e.target.value)}
                        className="p-1.5 text-xs rounded border border-border bg-bg-card"
                      />
                      <input
                        type="text"
                        value={edu.period}
                        placeholder="e.g. 2022 — 2026"
                        onChange={(e) => handleUpdateEducation(idx, 'period', e.target.value)}
                        className="p-1.5 text-xs rounded border border-border bg-bg-card"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Job Matcher Tab */}
            {activeTab === 'job-match' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-sm text-text">Job Description Matcher</h4>
                  <p className="text-[11px] text-text-muted">Compare your resume against real job requirements to beat the ATS screen.</p>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Target Role (e.g. SDE 1)"
                      value={jobTitleInput}
                      onChange={(e) => setJobTitleInput(e.target.value)}
                      className="p-2 text-xs rounded-xl border border-border bg-bg-card text-text"
                    />
                    <input
                      type="text"
                      placeholder="Company (optional)"
                      value={jobCompanyInput}
                      onChange={(e) => setJobCompanyInput(e.target.value)}
                      className="p-2 text-xs rounded-xl border border-border bg-bg-card text-text"
                    />
                  </div>

                  <textarea
                    rows={6}
                    placeholder="Paste the job description or requirements here..."
                    value={jobTextInput}
                    onChange={(e) => setJobTextInput(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-border bg-bg-card text-text placeholder-text-subtle focus:border-accent outline-none"
                  />

                  <button
                    disabled={isAnalyzingJob || !jobTextInput.trim()}
                    onClick={handleAnalyzeJobMatch}
                    className="w-full py-2.5 rounded-xl bg-accent text-accent-contrast text-xs font-semibold hover:bg-accent-hover disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>{isAnalyzingJob ? 'Analyzing Job Fit...' : 'Analyze Job Description Match'}</span>
                  </button>
                </div>

                {/* Match Analysis Results */}
                {jobMatchData && (
                  <div className="p-4 rounded-xl bg-bg border border-border space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text">ATS Job Alignment</span>
                      <span className="font-mono text-sm font-bold text-accent bg-accent-light px-2 py-0.5 rounded">
                        {jobMatchData.matchScore}% Match
                      </span>
                    </div>

                    {/* Matched Keywords */}
                    {jobMatchData.matchedKeywords?.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Matched Keywords ({jobMatchData.matchedKeywords.length}):
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {jobMatchData.matchedKeywords.map((kw, kIdx) => (
                            <span key={kIdx} className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              ✓ {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Keywords */}
                    {jobMatchData.missingKeywords?.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-red-600 dark:text-red-400">
                            Missing Keywords ({jobMatchData.missingKeywords.length}):
                          </span>
                          <button
                            onClick={handleAddMissingKeywords}
                            className="text-[10px] text-accent hover:underline font-semibold"
                          >
                            + Add Missing to Skills
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {jobMatchData.missingKeywords.map((kw, kIdx) => (
                            <span key={kIdx} className="px-2 py-0.5 rounded-full text-[10px] bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                              ! {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {jobMatchData.recommendations?.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-border/60">
                        <div className="text-[11px] font-semibold text-text">Recommendations:</div>
                        <ul className="list-disc list-inside space-y-0.5 text-[10px] text-text-muted">
                          {jobMatchData.recommendations.map((rec, rIdx) => (
                            <li key={rIdx}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Live A4 Resume Preview (7 cols) */}
        <div className="lg:col-span-7">
          <div className="no-print flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-text-subtle uppercase tracking-wider">
              Live A4 Print Preview ({template.toUpperCase()} TEMPLATE)
            </span>
            <button
              onClick={handlePrint}
              className="text-xs text-accent font-semibold hover:underline flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export</span>
            </button>
          </div>

          {/* Printable A4 Container */}
          <div
            ref={resumePrintRef}
            className={`w-full bg-white text-black p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-200 transition-all font-sans text-xs leading-normal min-h-[842px] ${
              template === 'classic'
                ? 'resume-classic'
                : template === 'modern'
                ? 'resume-modern'
                : 'resume-minimal'
            }`}
          >
            {/* Header: Name & Contact */}
            <header className="border-b pb-4 mb-4 border-gray-300">
              <h1 className={`text-2xl font-bold tracking-tight text-gray-900 ${template === 'classic' ? 'font-serif' : ''}`}>
                {resume.personal?.fullName || 'Your Name'}
              </h1>
              {resume.personal?.title && (
                <div className="text-sm font-semibold text-gray-700 mt-0.5">
                  {resume.personal.title}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-600 mt-2">
                {resume.personal?.email && <span>{resume.personal.email}</span>}
                {resume.personal?.phone && <span>• {resume.personal.phone}</span>}
                {resume.personal?.location && <span>• {resume.personal.location}</span>}
                {resume.personal?.linkedin && <span>• {resume.personal.linkedin}</span>}
                {resume.personal?.github && <span>• {resume.personal.github}</span>}
              </div>
            </header>

            {/* Summary */}
            {resume.personal?.summary && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-1.5">
                  Professional Summary
                </h2>
                <p className="text-[11px] text-gray-700 leading-relaxed">
                  {resume.personal.summary}
                </p>
              </section>
            )}

            {/* Technical Skills */}
            {resume.skills && resume.skills.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-1.5">
                  Technical Competencies
                </h2>
                <div className="text-[11px] text-gray-800 leading-relaxed">
                  <strong>Core Stack: </strong>
                  {resume.skills.join(', ')}
                </div>
              </section>
            )}

            {/* Experience */}
            {resume.experience && resume.experience.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-2">
                  Experience & Internships
                </h2>
                <div className="space-y-3">
                  {resume.experience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-gray-900">{exp.role}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{exp.period}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-[11px] text-gray-600 italic mb-1">
                        <span>{exp.company}</span>
                        <span>{exp.location}</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-700">
                        {(exp.bullets || []).map((b, bIdx) => (
                          <li key={bIdx} className="leading-snug">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {resume.projects && resume.projects.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-2">
                  Key Technical Projects
                </h2>
                <div className="space-y-3">
                  {resume.projects.map((proj, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-gray-900">{proj.title}</span>
                        {proj.link && (
                          <span className="text-[10px] text-gray-500 font-mono">{proj.link}</span>
                        )}
                      </div>
                      {proj.tech && (
                        <div className="text-[10px] text-gray-600 font-mono mb-1">
                          Stack: {proj.tech}
                        </div>
                      )}
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-gray-700">
                        {(proj.bullets || []).map((b, bIdx) => (
                          <li key={bIdx} className="leading-snug">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {resume.education && resume.education.length > 0 && (
              <section className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-2">
                  Education
                </h2>
                <div className="space-y-2">
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-baseline text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{edu.institution}</div>
                        <div className="text-[11px] text-gray-700">{edu.degree}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-500 font-mono">{edu.period}</div>
                        <div className="text-[11px] font-semibold text-gray-800">{edu.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications & Achievements */}
            {resume.certifications && resume.certifications.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1 mb-1.5">
                  Certifications & Honors
                </h2>
                <div className="space-y-1 text-[11px] text-gray-700">
                  {resume.certifications.map((cert, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>• {cert.name} ({cert.issuer})</span>
                      <span className="text-[10px] text-gray-500 font-mono">{cert.date}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
