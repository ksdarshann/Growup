import { useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Circle,
  Copy,
  Download,
  Plus,
  Printer,
  Trash2,
} from 'lucide-react';
import {
  BULLET_TRANSFORM_PRESETS,
  CAREER_TRACKS,
  STRONG_ACTION_VERBS,
} from '../data/careerData';
import { ResumeData, TrackId } from '../types';

interface ResumeStudioProps {
  resume: ResumeData;
  activeTrackId: TrackId;
  onUpdateResume: (next: ResumeData) => void;
  onNotify: (msg: string) => void;
}

export function ResumeStudio({
  resume,
  activeTrackId,
  onUpdateResume,
  onNotify,
}: ResumeStudioProps) {
  const activeTrack =
    CAREER_TRACKS.find((t) => t.id === activeTrackId) || CAREER_TRACKS[0];

  // Impact Bullet Transformer state
  const [selectedExpId, setSelectedExpId] = useState(
    resume.experiences[0]?.id || ''
  );
  const [verb, setVerb] = useState(BULLET_TRANSFORM_PRESETS[0].verb);
  const [what, setWhat] = useState(BULLET_TRANSFORM_PRESETS[0].what);
  const [metric, setMetric] = useState(BULLET_TRANSFORM_PRESETS[0].metric);
  const [outcome, setOutcome] = useState(BULLET_TRANSFORM_PRESETS[0].outcome);
  const [newSkill, setNewSkill] = useState('');

  const composedBullet = useMemo(() => {
    const parts = [
      `${verb} ${what.trim()}`,
      metric.trim(),
      outcome.trim(),
    ].filter(Boolean);
    const joined = parts.join(', ');
    return joined.endsWith('.') ? joined : `${joined}.`;
  }, [verb, what, metric, outcome]);

  // Deterministic Resume Quality Checklist
  const qualityChecks = useMemo(() => {
    const allBullets = resume.experiences.flatMap((e) => e.bullets);
    const quantifiedCount = allBullets.filter((b) => /\d+[%kKmMxX$+]?|\d+\s?(ms|hrs|hours|wks|weeks|sec|days)/i.test(b)).length;
    const verbCount = allBullets.filter((b) =>
      STRONG_ACTION_VERBS.some((v) =>
        b.trim().toLowerCase().startsWith(v.toLowerCase())
      )
    ).length;

    return [
      {
        label: 'At least 2 bullets quantify P&L, $, bps, or cycle-time impact',
        passed: quantifiedCount >= 2,
        detail: `${quantifiedCount} quantified`,
      },
      {
        label: 'Bullets lead with Post-MBA ownership action verbs',
        passed: allBullets.length > 0 && verbCount >= Math.min(2, allBullets.length),
        detail: `${verbCount} / ${allBullets.length}`,
      },
      {
        label: 'Executive summary stays crisp and scannable (under 45 words)',
        passed:
          resume.summary.trim().split(/\s+/).filter(Boolean).length >= 12 &&
          resume.summary.trim().split(/\s+/).filter(Boolean).length <= 45,
        detail: `${resume.summary.trim().split(/\s+/).filter(Boolean).length} words`,
      },
      {
        label: 'LinkedIn / Deal Sheet link included alongside MBA leadership proof',
        passed: Boolean(resume.portfolioUrl.trim()) && resume.projects.length > 0,
        detail: resume.portfolioUrl ? 'Linked' : 'Missing URL',
      },
    ];
  }, [resume]);

  const updateField = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    onUpdateResume({ ...resume, [key]: value });
  };

  const applyComposedBullet = () => {
    const targetId = selectedExpId || resume.experiences[0]?.id;
    if (!targetId || !what.trim()) return;
    const nextExperiences = resume.experiences.map((exp) =>
      exp.id === targetId
        ? { ...exp, bullets: [...exp.bullets, composedBullet] }
        : exp
    );
    updateField('experiences', nextExperiences);
    onNotify('Impact bullet added to your resume.');
  };

  const removeBullet = (expId: string, bulletIdx: number) => {
    const nextExperiences = resume.experiences.map((exp) =>
      exp.id === expId
        ? { ...exp, bullets: exp.bullets.filter((_, i) => i !== bulletIdx) }
        : exp
    );
    updateField('experiences', nextExperiences);
  };

  const addExperience = () => {
    const id = `exp-${Date.now()}`;
    updateField('experiences', [
      ...resume.experiences,
      {
        id,
        role: 'Role Title',
        organization: 'Organization Name',
        period: '2025 – Present',
        bullets: [
          'Built a targeted workflow improvement that cut manual processing time by 35%.',
        ],
      },
    ]);
    setSelectedExpId(id);
  };

  const removeExperience = (expId: string) => {
    if (resume.experiences.length <= 1) return;
    updateField(
      'experiences',
      resume.experiences.filter((e) => e.id !== expId)
    );
  };

  const addTrackCapstoneProject = () => {
    const alreadyExists = resume.projects.some(
      (p) => p.name === activeTrack.portfolioBrief.title
    );
    if (alreadyExists) {
      onNotify('This track capstone is already in your projects list.');
      return;
    }
    updateField('projects', [
      ...resume.projects,
      {
        id: `proj-${Date.now()}`,
        name: activeTrack.portfolioBrief.title,
        context: activeTrack.coreTools.slice(0, 3).join(' · '),
        summary: activeTrack.portfolioBrief.summary,
      },
    ]);
    onNotify('Track capstone added to your resume.');
  };

  const toggleSkill = (skill: string) => {
    if (resume.skills.includes(skill)) {
      updateField(
        'skills',
        resume.skills.filter((s) => s !== skill)
      );
    } else {
      updateField('skills', [...resume.skills, skill]);
    }
  };

  const addCustomSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || resume.skills.includes(trimmed)) return;
    updateField('skills', [...resume.skills, trimmed]);
    setNewSkill('');
  };

  const copyPlainText = async () => {
    const text = [
      resume.fullName,
      `${resume.targetRole} | ${resume.location} | ${resume.email} | ${resume.portfolioUrl}`,
      '',
      'SUMMARY',
      resume.summary,
      '',
      'SKILLS',
      resume.skills.join(', '),
      '',
      'EXPERIENCE',
      ...resume.experiences.flatMap((e) => [
        `${e.role} — ${e.organization} (${e.period})`,
        ...e.bullets.map((b) => `- ${b}`),
        '',
      ]),
      'PROJECTS',
      ...resume.projects.flatMap((p) => [
        `${p.name} (${p.context})`,
        p.summary,
        '',
      ]),
    ].join('\n');

    try {
      await navigator.clipboard.writeText(text);
      onNotify('ATS-friendly plain text copied to clipboard.');
    } catch {
      onNotify('Copy failed—try Print / Save PDF or Export JSON.');
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(resume.fullName || 'resume').toLowerCase().replace(/\s+/g, '-')}-resume.json`;
    a.click();
    URL.revokeObjectURL(url);
    onNotify('Resume data exported as JSON.');
  };

  return (
    <div className="space-y-8 pt-6">
      {/* Header */}
      <div className="no-print flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
        <div>
          <p className="text-sm font-medium text-[#1D4ED8] mb-2">
            Post-MBA Executive Resume Studio
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0F172A]">
            Turn MBA roles into quantified P&amp;L evidence.
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
            <span className="font-mono tabular-nums">
              {qualityChecks.filter((c) => c.passed).length} / {qualityChecks.length} quality checks passing
            </span>
            <span aria-hidden="true">·</span>
            <span>Live print-ready preview</span>
            <span aria-hidden="true">·</span>
            <span>Auto-saved locally</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={copyPlainText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Copy ATS Text</span>
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Export JSON</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Two-Zone Split: Editor (Left) + Live Document Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Interactive Editor & Impact Bullet Transformer */}
        <div className="no-print lg:col-span-6 space-y-6">
          {/* Deterministic Quality Checklist */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-3">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Recruiter Readiness Checklist
            </h2>
            <div className="space-y-2.5">
              {qualityChecks.map((chk) => (
                <div
                  key={chk.label}
                  className="flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5 text-[#334155]">
                    {chk.passed ? (
                      <CheckCircle2
                        className="w-4 h-4 text-[#047857] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                    )}
                    <span>{chk.label}</span>
                  </div>
                  <span className="font-mono tabular-nums text-[#64748B] whitespace-nowrap shrink-0">
                    {chk.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Impact Bullet Formula Workshop */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <div>
              <div className="text-xs font-medium text-[#1D4ED8]">
                Impact Bullet Transformer
              </div>
              <h2 className="mt-1 text-base font-semibold text-[#0F172A]">
                Formula: Action Verb + What You Built + Measurable Result
              </h2>
            </div>

            <div className="space-y-2">
              <div className="text-xs text-[#64748B]">
                Load a weak-to-strong example to study the pattern:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BULLET_TRANSFORM_PRESETS.map((preset) => (
                  <button
                    key={preset.verb + preset.what.slice(0, 12)}
                    type="button"
                    onClick={() => {
                      setVerb(preset.verb);
                      setWhat(preset.what);
                      setMetric(preset.metric);
                      setOutcome(preset.outcome);
                    }}
                    className="text-left p-2.5 rounded-lg border border-[#E2E8F0] hover:border-[#94A3B8] hover:bg-[#F8FAFC] text-xs text-[#475569] cursor-pointer"
                  >
                    <span className="line-through text-[#94A3B8] block truncate">
                      {preset.weak}
                    </span>
                    <span className="font-medium text-[#0F172A] mt-0.5 block">
                      Transform with &ldquo;{preset.verb}&rdquo;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label
                  htmlFor="bullet-verb"
                  className="block text-xs font-medium text-[#475569] mb-1"
                >
                  Action Verb
                </label>
                <select
                  id="bullet-verb"
                  value={verb}
                  onChange={(e) => setVerb(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                >
                  {STRONG_ACTION_VERBS.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="bullet-target-role"
                  className="block text-xs font-medium text-[#475569] mb-1"
                >
                  Insert Into Role
                </label>
                <select
                  id="bullet-target-role"
                  value={selectedExpId || resume.experiences[0]?.id || ''}
                  onChange={(e) => setSelectedExpId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                >
                  {resume.experiences.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.role} ({exp.organization})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  htmlFor="bullet-what"
                  className="block text-xs font-medium text-[#475569] mb-1"
                >
                  What you built, led, or improved
                </label>
                <input
                  id="bullet-what"
                  type="text"
                  value={what}
                  onChange={(e) => setWhat(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="bullet-metric"
                    className="block text-xs font-medium text-[#475569] mb-1"
                  >
                    Quantified Metric
                  </label>
                  <input
                    id="bullet-metric"
                    type="text"
                    value={metric}
                    onChange={(e) => setMetric(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="bullet-outcome"
                    className="block text-xs font-medium text-[#475569] mb-1"
                  >
                    User or Business Scope
                  </label>
                  <input
                    id="bullet-outcome"
                    type="text"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A]">
              <div className="text-[11px] font-medium text-[#64748B] mb-1">
                Generated Impact Bullet Preview
              </div>
              {composedBullet}
            </div>

            <button
              type="button"
              onClick={applyComposedBullet}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add Bullet to Selected Role</span>
            </button>
          </div>

          {/* Core Identity & Summary */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Header &amp; Positioning Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={resume.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={resume.targetRole}
                  onChange={(e) => updateField('targetRole', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={resume.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={resume.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  LinkedIn / Case Portfolio URL
                </label>
                <input
                  type="text"
                  value={resume.portfolioUrl}
                  onChange={(e) => updateField('portfolioUrl', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#475569] mb-1">
                  2-Line Positioning Summary
                </label>
                <textarea
                  rows={3}
                  value={resume.summary}
                  onChange={(e) => updateField('summary', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Skills Selector */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">
                Core Skills ({activeTrack.shortTitle} Suggestions)
              </h2>
              <p className="mt-1 text-xs text-[#64748B]">
                Click to toggle skills on or off your resume.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {Array.from(
                new Set([...activeTrack.recommendedSkills, ...resume.skills])
              ).map((skill) => {
                const active = resume.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                      active
                        ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8]'
                        : 'border-[#E2E8F0] bg-white text-[#475569] hover:border-[#94A3B8]'
                    }`}
                  >
                    {active && <Check className="w-3 h-3" aria-hidden="true" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill (e.g. LBO Modeling, Go-to-Market, M&A)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomSkill();
                  }
                }}
                className="flex-1 px-3 py-2 text-sm border border-[#CBD5E1] rounded-lg"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="px-4 py-2 text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg whitespace-nowrap cursor-pointer"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Experience & Projects Controls */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[#0F172A]">
                Experience &amp; Proof Projects
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={addTrackCapstoneProject}
                  className="px-3 py-1.5 text-xs font-medium text-[#1D4ED8] hover:bg-[#EFF6FF] rounded-lg whitespace-nowrap cursor-pointer"
                >
                  + Track Capstone
                </button>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg whitespace-nowrap cursor-pointer"
                >
                  + Add Role
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {resume.experiences.map((exp, idx) => (
                <div
                  key={exp.id}
                  className="pt-4 border-t border-[#E2E8F0] first:border-t-0 first:pt-0 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono text-[#64748B]">
                      Role 0{idx + 1}
                    </span>
                    {resume.experiences.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="inline-flex items-center gap-1 text-xs text-[#64748B] hover:text-[#B91C1C] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      aria-label="Role title"
                      value={exp.role}
                      onChange={(e) => {
                        const next = resume.experiences.map((item) =>
                          item.id === exp.id ? { ...item, role: e.target.value } : item
                        );
                        updateField('experiences', next);
                      }}
                      className="px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="text"
                      aria-label="Organization"
                      value={exp.organization}
                      onChange={(e) => {
                        const next = resume.experiences.map((item) =>
                          item.id === exp.id
                            ? { ...item, organization: e.target.value }
                            : item
                        );
                        updateField('experiences', next);
                      }}
                      className="px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                    <input
                      type="text"
                      aria-label="Time period"
                      value={exp.period}
                      onChange={(e) => {
                        const next = resume.experiences.map((item) =>
                          item.id === exp.id ? { ...item, period: e.target.value } : item
                        );
                        updateField('experiences', next);
                      }}
                      className="px-3 py-1.5 text-xs border border-[#CBD5E1] rounded-lg"
                    />
                  </div>
                  <ul className="space-y-2">
                    {exp.bullets.map((b, bIdx) => (
                      <li
                        key={`${exp.id}-${bIdx}`}
                        className="flex items-start justify-between gap-2 text-xs text-[#334155] bg-[#F8FAFC] p-2.5 rounded-lg"
                      >
                        <span>{b}</span>
                        <button
                          type="button"
                          aria-label="Delete bullet"
                          onClick={() => removeBullet(exp.id, bIdx)}
                          className="text-[#94A3B8] hover:text-[#B91C1C] shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Zone: Live Print-Ready Editorial Resume Preview */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="print-only-resume bg-white border border-[#CBD5E1] rounded-xl p-8 sm:p-10 shadow-xs space-y-6">
            {/* Document Header */}
            <header className="pb-5 border-b border-[#0F172A]/15">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
                {resume.fullName || 'Your Name'}
              </h2>
              <div className="mt-1 text-sm font-semibold text-[#1D4ED8]">
                {resume.targetRole || 'Target Role'}
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#475569]">
                <span>{resume.location}</span>
                <span aria-hidden="true">·</span>
                <span>{resume.email}</span>
                {resume.portfolioUrl && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{resume.portfolioUrl}</span>
                  </>
                )}
              </div>
            </header>

            {/* Summary */}
            {resume.summary.trim() && (
              <section className="space-y-1.5">
                <h3 className="text-xs font-semibold tracking-wide text-[#475569]">
                  Profile Summary
                </h3>
                <p className="text-sm leading-relaxed text-[#1E293B]">
                  {resume.summary}
                </p>
              </section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <section className="space-y-1.5">
                <h3 className="text-xs font-semibold tracking-wide text-[#475569]">
                  Core Capabilities
                </h3>
                <p className="text-sm leading-relaxed text-[#1E293B]">
                  {resume.skills.join(' · ')}
                </p>
              </section>
            )}

            {/* Experience */}
            <section className="space-y-4">
              <h3 className="text-xs font-semibold tracking-wide text-[#475569] pb-1 border-b border-[#E2E8F0]">
                Relevant Experience
              </h3>
              {resume.experiences.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {exp.role}
                      </span>
                      <span className="text-sm text-[#475569]">
                        {' '}
                        — {exp.organization}
                      </span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-[#64748B]">
                      {exp.period}
                    </span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-sm leading-relaxed text-[#1E293B]">
                    {exp.bullets.map((b, i) => (
                      <li key={`${exp.id}-prev-${i}`}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Projects */}
            {resume.projects.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xs font-semibold tracking-wide text-[#475569] pb-1 border-b border-[#E2E8F0]">
                  Selected Case &amp; Deal Proof
                </h3>
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-[#0F172A]">
                        {proj.name}
                      </span>
                      <span className="text-xs text-[#64748B]">{proj.context}</span>
                    </div>
                    <p className="text-sm leading-relaxed text-[#1E293B]">
                      {proj.summary}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
