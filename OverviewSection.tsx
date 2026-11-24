import { useRef, useState } from 'react';
import { ArrowRight, Check, Compass, RotateCcw } from 'lucide-react';
import {
  CAREER_TRACKS,
  DIAGNOSTIC_QUESTIONS,
  HERO_IMAGE_PATH,
} from '../data/careerData';
import { TrackId, UserProgressState, WorkspaceTab } from '../types';
import { ResilientImage } from './ResilientImage';

interface OverviewSectionProps {
  progress: UserProgressState;
  onSelectTrack: (trackId: TrackId, weeklyHours?: number, markDiagnostic?: boolean) => void;
  onNavigate: (tab: WorkspaceTab) => void;
  onOpenTrack: (trackId: TrackId) => void;
}

const WEEKLY_HOURS_OPTIONS = [6, 10, 15, 20];

export function OverviewSection({
  progress,
  onSelectTrack,
  onNavigate,
  onOpenTrack,
}: OverviewSectionProps) {
  const compassRef = useRef<HTMLElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const activeTrack =
    CAREER_TRACKS.find((t) => t.id === progress.activeTrackId) || CAREER_TRACKS[0];

  const totalModules = CAREER_TRACKS.reduce((sum, t) => sum + t.modules.length, 0);
  const resumeReadySections = [
    Boolean(progress.resume.fullName.trim() && progress.resume.targetRole.trim()),
    progress.resume.skills.length >= 4,
    progress.resume.experiences.some((e) => e.bullets.length > 0),
    Boolean(progress.resume.portfolioUrl.trim() && progress.resume.projects.length > 0),
  ].filter(Boolean).length;

  const scrollToCompass = () => {
    compassRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSelectOption = (optionIdx: number) => {
    const nextAnswers = [...answers];
    nextAnswers[stepIndex] = optionIdx;
    setAnswers(nextAnswers);

    if (stepIndex < DIAGNOSTIC_QUESTIONS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetDiagnostic = () => {
    setAnswers([]);
    setStepIndex(0);
    setShowResult(false);
  };

  const computeRecommendation = () => {
    const scores: Record<TrackId, number> = {
      consulting: 0,
      finance: 0,
      product: 0,
      operations: 0,
    };

    DIAGNOSTIC_QUESTIONS.slice(0, 3).forEach((q, idx) => {
      const chosen = answers[idx];
      if (chosen !== undefined && q.options[chosen]) {
        const w = q.options[chosen].weights;
        scores.consulting += w.consulting;
        scores.finance += w.finance;
        scores.product += w.product;
        scores.operations += w.operations;
      }
    });

    const ranked = (Object.entries(scores) as [TrackId, number][]).sort(
      (a, b) => b[1] - a[1]
    );
    const topTrackId = ranked[0]?.[0] || 'consulting';
    const topTrack =
      CAREER_TRACKS.find((t) => t.id === topTrackId) || CAREER_TRACKS[0];
    const hoursPerWeek = WEEKLY_HOURS_OPTIONS[answers[3] ?? 1] || 10;
    const estimatedWeeks = Math.max(4, Math.ceil(topTrack.totalHours / hoursPerWeek));

    return {
      topTrack,
      ranked,
      hoursPerWeek,
      estimatedWeeks,
      maxPossible: 9,
    };
  };

  const result = showResult ? computeRecommendation() : null;

  return (
    <div className="space-y-20">
      {/* Hero Split (items-stretch for balanced height) */}
      <section className="pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between py-1">
            <div>
              <p className="text-sm font-medium text-[#1D4ED8] mb-4">
                Post-MBA Career &amp; Case Prep Studio
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight leading-[1.08] text-[#0F172A] text-balance">
                Master executive judgment and land your Post-MBA role.
              </h1>
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#475569] max-w-[54ch]">
                Built for MBA graduates and final-year candidates preparing for Consulting, Investment Banking, Tech Product Strategy, and General Management. Drill live case math, DCF models, executive resumes, and PEI interviews in one focused workspace.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <button
                  type="button"
                  onClick={scrollToCompass}
                  className="inline-flex items-center gap-2.5 px-6 py-3 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Take Post-MBA Diagnostic</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('tracks')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F172A] hover:text-[#1D4ED8] underline underline-offset-4 decoration-[#CBD5E1] hover:decoration-[#1D4ED8] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer py-2"
                >
                  <span>Explore 4 Post-MBA tracks</span>
                </button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
              <span>MBB Consulting</span>
              <span aria-hidden="true">·</span>
              <span>IB &amp; Corporate Finance</span>
              <span aria-hidden="true">·</span>
              <span>Tech PM &amp; Strategy</span>
              <span aria-hidden="true">·</span>
              <span>General Management &amp; LDP</span>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="h-full min-h-[280px] lg:min-h-[420px] rounded-xl overflow-hidden border border-[#E2E8F0] bg-[#EEF2F6]">
              <ResilientImage
                src={HERO_IMAGE_PATH}
                alt="Sunlit Post-MBA study workspace with strategy diagrams in a notebook and laptop"
                fallbackTitle="Craftpath Post-MBA Studio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Live Progress Strip below Hero Split */}
        <div className="mt-12 bg-white border border-[#E2E8F0] rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
          <button
            type="button"
            onClick={() => onNavigate('tracks')}
            className="p-6 text-left hover:bg-[#F8FAFC] transition-colors duration-150 cursor-pointer first:rounded-t-xl sm:first:rounded-l-xl sm:first:rounded-tr-none"
          >
            <div className="text-xs font-medium text-[#64748B]">Target Post-MBA Track</div>
            <div className="mt-2 text-lg font-semibold text-[#0F172A] truncate">
              {activeTrack.shortTitle}
            </div>
            <div className="mt-1 text-xs text-[#475569] tabular-nums">
              {progress.weeklyHours} hrs/week pace ·{' '}
              {Math.ceil(activeTrack.totalHours / progress.weeklyHours)} wks prep
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tracks')}
            className="p-6 text-left hover:bg-[#F8FAFC] transition-colors duration-150 cursor-pointer"
          >
            <div className="text-xs font-medium text-[#64748B]">Curriculum Modules</div>
            <div className="mt-2 text-2xl font-semibold text-[#0F172A] font-mono tabular-nums">
              {progress.completedModuleIds.length}{' '}
              <span className="text-base font-normal text-[#64748B]">/ {totalModules}</span>
            </div>
            <div className="mt-1 text-xs text-[#475569]">
              Frameworks, financial models &amp; drills
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="p-6 text-left hover:bg-[#F8FAFC] transition-colors duration-150 cursor-pointer"
          >
            <div className="text-xs font-medium text-[#64748B]">Case &amp; Finance Labs</div>
            <div className="mt-2 text-2xl font-semibold text-[#0F172A] font-mono tabular-nums">
              {progress.passedPracticeMissions.length}{' '}
              <span className="text-base font-normal text-[#64748B]">/ 12</span>
            </div>
            <div className="mt-1 text-xs text-[#475569]">
              EBITDA, DCF, SaaS &amp; ROIC missions
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('resume')}
            className="p-6 text-left hover:bg-[#F8FAFC] transition-colors duration-150 cursor-pointer last:rounded-b-xl sm:last:rounded-r-xl sm:last:rounded-bl-none"
          >
            <div className="text-xs font-medium text-[#64748B]">Recruiting Assets Ready</div>
            <div className="mt-2 text-2xl font-semibold text-[#0F172A] font-mono tabular-nums">
              {resumeReadySections}
              <span className="text-base font-normal text-[#64748B]">/4</span>
              <span className="text-sm font-sans font-normal text-[#64748B] ml-2">
                · {Object.keys(progress.interviewStories).length} PEI stories
              </span>
            </div>
            <div className="mt-1 text-xs text-[#475569]">
              MBA resume audit &amp; interview bank
            </div>
          </button>
        </div>
      </section>

      {/* Interactive Post-MBA Career Compass Diagnostic */}
      <section
        ref={compassRef}
        id="career-compass"
        className="scroll-mt-24 pt-4 border-t border-[#E2E8F0]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-[#1D4ED8]">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>01. Post-MBA Recruiting Compass</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A] text-balance">
              Align your MBA strengths with your highest-fit offer path.
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#475569]">
              Answer four executive career questions to pinpoint your optimal Post-MBA recruiting track, benchmark total compensation, and build a realistic prep schedule.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#64748B]">
              <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0]">
                <span>Current step</span>
                <span className="font-mono tabular-nums text-[#0F172A]">
                  {showResult
                    ? '4 / 4 Complete'
                    : `${stepIndex + 1} / ${DIAGNOSTIC_QUESTIONS.length}`}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#E2E8F0]">
                <span>Output</span>
                <span className="text-[#0F172A]">Track fit &amp; prep timeline</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8">
            {!showResult ? (
              <div>
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                  <span className="text-xs font-medium text-[#64748B] font-mono tabular-nums">
                    Question {stepIndex + 1} of {DIAGNOSTIC_QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    {DIAGNOSTIC_QUESTIONS.map((q, idx) => (
                      <div
                        key={q.id}
                        className={`h-1.5 w-8 rounded-full transition-colors duration-150 ${
                          idx <= stepIndex ? 'bg-[#1D4ED8]' : 'bg-[#E2E8F0]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="mt-6 text-xl sm:text-2xl font-semibold text-[#0F172A] text-balance">
                  {DIAGNOSTIC_QUESTIONS[stepIndex].question}
                </h3>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {DIAGNOSTIC_QUESTIONS[stepIndex].options.map((opt, idx) => {
                    const isSelected = answers[stepIndex] === idx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className={`text-left p-5 rounded-lg border transition-colors duration-150 cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                            : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
                        }`}
                      >
                        <div className="text-sm font-semibold text-[#0F172A]">
                          {opt.label}
                        </div>
                        <div className="text-xs leading-relaxed text-[#475569]">
                          {opt.description}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {stepIndex > 0 && (
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStepIndex(stepIndex - 1)}
                      className="text-sm font-medium text-[#475569] hover:text-[#0F172A] cursor-pointer py-1.5"
                    >
                      Previous question
                    </button>
                    <button
                      type="button"
                      onClick={resetDiagnostic}
                      className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] cursor-pointer py-1.5"
                    >
                      Start over
                    </button>
                  </div>
                )}
              </div>
            ) : result ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E2E8F0]">
                  <div>
                    <p className="text-xs font-medium text-[#047857]">
                      Recommended Post-MBA Path
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold text-[#0F172A]">
                      {result.topTrack.title}
                    </h3>
                    <p className="mt-2 text-sm text-[#475569] max-w-[60ch]">
                      {result.topTrack.tagline}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetDiagnostic}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Retake</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="text-xs text-[#64748B]">Weekly Prep Pace</div>
                    <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-[#0F172A]">
                      {result.hoursPerWeek} hrs / week
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="text-xs text-[#64748B]">Prep Runway</div>
                    <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-[#0F172A]">
                      {result.estimatedWeeks} weeks
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="text-xs text-[#64748B]">Post-MBA Total Comp</div>
                    <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-[#0F172A]">
                      {result.topTrack.salaryBand}
                    </div>
                  </div>
                </div>

                {/* Transparent Affinity Breakdown */}
                <div className="space-y-3">
                  <div className="text-xs font-medium text-[#64748B]">
                    Alignment Breakdown Across Post-MBA Paths
                  </div>
                  <div className="space-y-2.5">
                    {result.ranked.map(([tid, score]) => {
                      const trackObj = CAREER_TRACKS.find((t) => t.id === tid)!;
                      const pct = Math.round((score / result.maxPossible) * 100);
                      return (
                        <div key={tid} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-[#0F172A]">
                              {trackObj.title}
                            </span>
                            <span className="font-mono tabular-nums text-[#475569]">
                              {pct}% alignment
                            </span>
                          </div>
                          <div className="h-2 w-full bg-[#EEF2F6] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                tid === result.topTrack.id
                                  ? 'bg-[#1D4ED8]'
                                  : 'bg-[#94A3B8]'
                              }`}
                              style={{ width: `${Math.max(8, pct)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTrack(result.topTrack.id, result.hoursPerWeek, true);
                      onNavigate('tracks');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Check className="w-4 h-4" aria-hidden="true" />
                    <span>Set Active Track &amp; Start Prep</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('practice')}
                    className="px-4 py-2.5 text-sm font-medium text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Open Case &amp; Finance Labs
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Four Post-MBA Career Tracks Showcase */}
      <section className="pt-4 border-t border-[#E2E8F0]">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-[#1D4ED8] mb-2">
              02. Post-MBA Recruiting Tracks
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F172A]">
              Four executive pathways from technical mastery to final-round offers.
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('tracks')}
            className="text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Open curriculum studio</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CAREER_TRACKS.map((track) => {
            const completedCount = track.modules.filter((m) =>
              progress.completedModuleIds.includes(m.id)
            ).length;
            const isActive = progress.activeTrackId === track.id;

            return (
              <article
                key={track.id}
                className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden flex flex-col justify-between transition-colors duration-150 hover:border-[#94A3B8]"
              >
                <div>
                  <div className="aspect-[16/10] bg-[#EEF2F6] overflow-hidden border-b border-[#E2E8F0]">
                    <ResilientImage
                      src={track.image}
                      alt={track.imageAlt}
                      fallbackTitle={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#64748B]">
                      <span>{track.levelRange}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{track.totalHours} hrs</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{track.salaryBand}</span>
                      {isActive && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-[#1D4ED8]">Active Track</span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-2.5 text-xl font-semibold text-[#0F172A]">
                      {track.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                      {track.tagline}
                    </p>

                    <div className="mt-4 text-xs text-[#64748B]">
                      Core toolkit: {track.coreTools.join(' · ')}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-4">
                  <span className="text-xs font-mono tabular-nums text-[#475569]">
                    {completedCount} / {track.modules.length} modules completed
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenTrack(track.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{completedCount > 0 ? 'Continue prep' : 'Explore track'}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
