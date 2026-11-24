import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Circle,
  RotateCcw,
} from 'lucide-react';
import { CAREER_TRACKS } from '../data/careerData';
import { TrackId, UserProgressState, WorkspaceTab } from '../types';

interface TracksWorkspaceProps {
  progress: UserProgressState;
  onSelectTrack: (trackId: TrackId) => void;
  onUpdateWeeklyHours: (hours: number) => void;
  onToggleModuleComplete: (moduleId: string) => void;
  onToggleSubSkill: (skillKey: string) => void;
  onToggleDeliverable: (deliverableKey: string) => void;
  onNavigate: (tab: WorkspaceTab) => void;
}

export function TracksWorkspace({
  progress,
  onSelectTrack,
  onUpdateWeeklyHours,
  onToggleModuleComplete,
  onToggleSubSkill,
  onToggleDeliverable,
  onNavigate,
}: TracksWorkspaceProps) {
  const track =
    CAREER_TRACKS.find((t) => t.id === progress.activeTrackId) || CAREER_TRACKS[0];

  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  const currentModule = track.modules[activeModuleIndex] || track.modules[0];

  // Reset module index when track changes
  useEffect(() => {
    const firstIncomplete = track.modules.findIndex(
      (m) => !progress.completedModuleIds.includes(m.id)
    );
    setActiveModuleIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
  }, [track.id]);

  // Reset interactive concept sliders & quiz when module changes
  useEffect(() => {
    const defaults: Record<string, number> = {};
    currentModule.conceptModel.sliders.forEach((s) => {
      defaults[s.id] = s.defaultValue;
    });
    setSliderValues(defaults);
    setSelectedQuizOption(null);
  }, [currentModule.id]);

  const isModuleCompleted = progress.completedModuleIds.includes(currentModule.id);
  const trackCompletedCount = track.modules.filter((m) =>
    progress.completedModuleIds.includes(m.id)
  ).length;
  const remainingHours = track.modules
    .filter((m) => !progress.completedModuleIds.includes(m.id))
    .reduce((sum, m) => sum + m.durationHours, 0);
  const weeksRemaining =
    remainingHours === 0
      ? 0
      : Math.max(1, Math.ceil(remainingHours / progress.weeklyHours));

  const targetFinishDate = new Date(
    Date.now() + weeksRemaining * 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const modelOutput = currentModule.conceptModel.evaluate(sliderValues);

  const resetSliders = () => {
    const defaults: Record<string, number> = {};
    currentModule.conceptModel.sliders.forEach((s) => {
      defaults[s.id] = s.defaultValue;
    });
    setSliderValues(defaults);
  };

  return (
    <div className="space-y-8 pt-6">
      {/* Header & Track Selector */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
        <div>
          <p className="text-sm font-medium text-[#1D4ED8] mb-2">
            Post-MBA Curriculum &amp; Interactive Models
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0F172A]">
            {track.title}
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
            <span>{track.levelRange}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{track.salaryBand} Post-MBA total comp</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {trackCompletedCount} of {track.modules.length} stages complete
            </span>
          </div>
        </div>

        {/* Segmented Track Switcher (interactive buttons allowed per skill guidelines) */}
        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EEF2F6] rounded-lg border border-[#E2E8F0] self-start lg:self-auto"
          role="tablist"
          aria-label="Career tracks"
        >
          {CAREER_TRACKS.map((t) => {
            const active = t.id === track.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onSelectTrack(t.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-[#475569] hover:text-[#0F172A]'
                }`}
              >
                {t.shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Progression Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {track.modules.map((mod, idx) => {
          const done = progress.completedModuleIds.includes(mod.id);
          const selected = idx === activeModuleIndex;
          return (
            <button
              key={mod.id}
              type="button"
              onClick={() => setActiveModuleIndex(idx)}
              className={`text-left p-4 rounded-xl border transition-colors duration-150 cursor-pointer ${
                selected
                  ? 'bg-white border-[#1D4ED8]'
                  : 'bg-white border-[#E2E8F0] hover:border-[#94A3B8]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono tabular-nums text-[#64748B]">
                  Stage 0{mod.stageNumber} · {mod.durationHours}h
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-medium ${
                    done
                      ? 'text-[#047857]'
                      : selected
                      ? 'text-[#1D4ED8]'
                      : 'text-[#64748B]'
                  }`}
                >
                  {done ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Done</span>
                    </>
                  ) : selected ? (
                    <span>Active</span>
                  ) : (
                    <span>Up next</span>
                  )}
                </span>
              </div>
              <div className="mt-2 text-sm font-semibold text-[#0F172A] line-clamp-2">
                {mod.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Two-Zone Educational Workbench (Left: Interactive Lesson Stage, Right: Controls & Portfolio Deck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Interactive Lesson Stage (~66%) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-8">
            {/* Module Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
              <div className="space-y-2 max-w-[58ch]">
                <div className="text-xs font-medium text-[#64748B] font-mono tabular-nums">
                  Stage 0{currentModule.stageNumber} of 04 · Est. {currentModule.durationHours} study hours
                </div>
                <h2 className="text-2xl font-semibold text-[#0F172A]">
                  {currentModule.title}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-[#475569]">
                  {currentModule.summary}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onToggleModuleComplete(currentModule.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                  isModuleCompleted
                    ? 'bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0] hover:bg-[#D1FAE5]'
                    : 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                }`}
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>{isModuleCompleted ? 'Completed' : 'Mark Stage Complete'}</span>
              </button>
            </div>

            {/* Key Principles (concise, zero wall-of-text) */}
            <div>
              <h3 className="text-base font-semibold text-[#0F172A] mb-3">
                Core Principles to Master
              </h3>
              <ul className="space-y-3">
                {currentModule.keyTakeaways.map((point, idx) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm leading-relaxed text-[#334155]"
                  >
                    <span className="font-mono text-xs text-[#64748B] mt-0.5 tabular-nums shrink-0">
                      0{idx + 1}.
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Concept Model / Parameter Sandbox */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-[#1D4ED8]">
                    Interactive Concept Model
                  </div>
                  <h3 className="mt-1 text-lg font-semibold text-[#0F172A]">
                    {currentModule.conceptModel.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#475569]">
                    {currentModule.conceptModel.prompt}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetSliders}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="text-xs font-mono text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-2.5">
                {currentModule.conceptModel.formulaLabel}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Sliders */}
                <div className="space-y-5">
                  {currentModule.conceptModel.sliders.map((slider) => {
                    const val = sliderValues[slider.id] ?? slider.defaultValue;
                    return (
                      <div key={slider.id} className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <label
                            htmlFor={`slider-${currentModule.id}-${slider.id}`}
                            className="font-medium text-[#0F172A]"
                          >
                            {slider.label}
                          </label>
                          <span className="font-mono font-medium tabular-nums text-[#1D4ED8]">
                            {val} {slider.unit}
                          </span>
                        </div>
                        <input
                          id={`slider-${currentModule.id}-${slider.id}`}
                          type="range"
                          min={slider.min}
                          max={slider.max}
                          step={slider.step}
                          value={val}
                          onChange={(e) =>
                            setSliderValues((prev) => ({
                              ...prev,
                              [slider.id]: Number(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-[#E2E8F0] rounded-lg cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] font-mono tabular-nums text-[#64748B]">
                          <span>
                            {slider.min} {slider.unit}
                          </span>
                          <span>
                            {slider.max} {slider.unit}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live Model Readout (dual-coded status: icon + text + color) */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
                    <span className="text-xs font-medium text-[#64748B]">
                      Model Readout
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        modelOutput.status === 'nominal'
                          ? 'text-[#047857]'
                          : modelOutput.status === 'caution'
                          ? 'text-[#B45309]'
                          : 'text-[#B91C1C]'
                      }`}
                    >
                      {modelOutput.status === 'nominal' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>{modelOutput.statusLabel}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-[#64748B]">
                        {modelOutput.primaryMetricLabel}
                      </div>
                      <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#0F172A]">
                        {modelOutput.primaryMetricValue}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-[#64748B]">
                        {modelOutput.secondaryMetricLabel}
                      </div>
                      <div className="mt-1 text-xl font-semibold font-mono tabular-nums text-[#0F172A]">
                        {modelOutput.secondaryMetricValue}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-[#334155]">
                    {modelOutput.insight}
                  </p>
                </div>
              </div>
            </div>

            {/* Applied Mastery Check */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-4">
              <div>
                <div className="text-xs font-medium text-[#1D4ED8]">
                  Applied Mastery Check
                </div>
                <h3 className="mt-1 text-base font-semibold text-[#0F172A]">
                  {currentModule.masteryQuestion.prompt}
                </h3>
              </div>

              <div className="space-y-2.5">
                {currentModule.masteryQuestion.options.map((opt, idx) => {
                  const chosen = selectedQuizOption === idx;
                  const isCorrect = idx === currentModule.masteryQuestion.correctIndex;
                  const answered = selectedQuizOption !== null;

                  let style =
                    'border-[#E2E8F0] bg-white hover:border-[#94A3B8] text-[#0F172A]';
                  if (answered && isCorrect) {
                    style = 'border-[#047857] bg-[#ECFDF5] text-[#064E3B]';
                  } else if (answered && chosen && !isCorrect) {
                    style = 'border-[#B91C1C] bg-[#FEF2F2] text-[#7F1D1D]';
                  }

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedQuizOption(idx)}
                      className={`w-full text-left px-4 py-3.5 rounded-lg border text-sm transition-colors duration-150 cursor-pointer flex items-start justify-between gap-3 ${style}`}
                    >
                      <span>{opt}</span>
                      {answered && isCorrect && (
                        <span className="text-xs font-semibold text-[#047857] whitespace-nowrap shrink-0">
                          Correct
                        </span>
                      )}
                      {answered && chosen && !isCorrect && (
                        <span className="text-xs font-semibold text-[#B91C1C] whitespace-nowrap shrink-0">
                          Reconsider
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedQuizOption !== null && (
                <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#334155]">
                  <span className="font-semibold text-[#0F172A]">Explanation: </span>
                  {currentModule.masteryQuestion.explanation}
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('practice')}
                  className="text-sm font-semibold text-[#1D4ED8] hover:text-[#1E40AF] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Apply this skill in Practice Lab</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                {activeModuleIndex < track.modules.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveModuleIndex(activeModuleIndex + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#0F172A] border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: Skill Checklist, Weekly Sprint Calculator & Portfolio Deliverables (~33%) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Study Pace & Completion Estimator */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-[#0F172A]">
                Weekly Study Pace
              </h3>
              <span className="text-sm font-mono font-semibold tabular-nums text-[#1D4ED8]">
                {progress.weeklyHours} hrs/wk
              </span>
            </div>
            <input
              type="range"
              aria-label="Weekly study hours"
              min={3}
              max={20}
              step={1}
              value={progress.weeklyHours}
              onChange={(e) => onUpdateWeeklyHours(Number(e.target.value))}
              className="w-full h-2 bg-[#E2E8F0] rounded-lg cursor-pointer"
            />
            <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-[#64748B]">Remaining Study</div>
                <div className="mt-1 text-base font-semibold font-mono tabular-nums text-[#0F172A]">
                  {remainingHours} hrs
                </div>
              </div>
              <div>
                <div className="text-[#64748B]">Projected Finish</div>
                <div className="mt-1 text-base font-semibold font-mono tabular-nums text-[#0F172A]">
                  {weeksRemaining === 0 ? 'Complete' : targetFinishDate}
                </div>
              </div>
            </div>
          </div>

          {/* Current Stage Sub-Skills Checklist */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-[#0F172A]">
                Stage 0{currentModule.stageNumber} Skill Checklist
              </h3>
              <p className="mt-1 text-xs text-[#64748B]">
                Check off sub-skills as you build confidence.
              </p>
            </div>
            <div className="space-y-2.5">
              {currentModule.subSkills.map((skill) => {
                const key = `${currentModule.id}:${skill}`;
                const checked = progress.checkedSubSkills.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onToggleSubSkill(key)}
                    className="w-full text-left flex items-start gap-3 py-2 text-sm text-[#334155] hover:text-[#0F172A] cursor-pointer"
                  >
                    {checked ? (
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
                    <span className={checked ? 'line-through text-[#64748B]' : ''}>
                      {skill}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Capstone Portfolio Proof Brief */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4">
            <div>
              <div className="text-xs font-medium text-[#1D4ED8]">
                Executive Case / Memo Proof
              </div>
              <h3 className="mt-1 text-base font-semibold text-[#0F172A]">
                {track.portfolioBrief.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#475569]">
                {track.portfolioBrief.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
              {track.portfolioBrief.deliverables.map((item) => {
                const key = `${track.id}:${item}`;
                const checked = progress.checkedDeliverables.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onToggleDeliverable(key)}
                    className="w-full text-left flex items-start gap-2.5 py-1.5 text-xs leading-relaxed text-[#334155] hover:text-[#0F172A] cursor-pointer"
                  >
                    {checked ? (
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
                    <span className={checked ? 'line-through text-[#64748B]' : ''}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => onNavigate('resume')}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#0F172A] bg-[#F8FAFC] hover:bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              Add Case / Memo to Resume Studio
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
