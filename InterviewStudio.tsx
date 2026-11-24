import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  Save,
} from 'lucide-react';
import { INTERVIEW_QUESTIONS, INTERVIEW_RUBRIC } from '../data/careerData';
import { SavedInterviewStory, TrackId } from '../types';

interface InterviewStudioProps {
  activeTrackId: TrackId;
  savedStories: Record<string, SavedInterviewStory>;
  onSaveStory: (story: SavedInterviewStory) => void;
  onNotify: (msg: string) => void;
}

type FilterOption = 'all' | 'general' | TrackId;

export function InterviewStudio({
  activeTrackId,
  savedStories,
  onSaveStory,
  onNotify,
}: InterviewStudioProps) {
  const [filter, setFilter] = useState<FilterOption>(activeTrackId);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    INTERVIEW_QUESTIONS.find((q) => q.trackId === activeTrackId)?.id ||
      INTERVIEW_QUESTIONS[0].id
  );
  const [showSample, setShowSample] = useState(false);

  // Timer state (120 seconds default standard behavioral answer target)
  const [targetDuration, setTargetDuration] = useState(120);
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [isRunning, setIsRunning] = useState(false);

  // STAR editor state
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [checkedRubric, setCheckedRubric] = useState<number[]>([]);

  const filteredQuestions = useMemo(() => {
    if (filter === 'all') return INTERVIEW_QUESTIONS;
    if (filter === 'general') {
      return INTERVIEW_QUESTIONS.filter((q) => q.trackId === 'general');
    }
    return INTERVIEW_QUESTIONS.filter(
      (q) => q.trackId === filter || q.trackId === 'general'
    );
  }, [filter]);

  const currentQuestion =
    INTERVIEW_QUESTIONS.find((q) => q.id === selectedQuestionId) ||
    filteredQuestions[0] ||
    INTERVIEW_QUESTIONS[0];

  // Sync draft editor when changing question
  useEffect(() => {
    const existing = savedStories[currentQuestion.id];
    if (existing) {
      setSituation(existing.situation);
      setTask(existing.task);
      setAction(existing.action);
      setResult(existing.result);
      setCheckedRubric(existing.checkedRubric);
    } else {
      setSituation('');
      setTask('');
      setAction('');
      setResult('');
      setCheckedRubric([]);
    }
    setShowSample(false);
    setIsRunning(false);
    setSecondsLeft(targetDuration);
  }, [currentQuestion.id]);

  // Countdown tick
  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = Math.round(((targetDuration - secondsLeft) / targetDuration) * 100);

  const toggleRubricIndex = (idx: number) => {
    setCheckedRubric((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSave = () => {
    if (!situation.trim() && !action.trim() && !result.trim()) {
      onNotify('Draft at least one STAR section before saving.');
      return;
    }
    onSaveStory({
      questionId: currentQuestion.id,
      situation,
      task,
      action,
      result,
      checkedRubric,
      updatedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    });
    onNotify('STAR story saved to your personal interview bank.');
  };

  const wordCount = [situation, task, action, result]
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const estSpokenSeconds = Math.round((wordCount / 145) * 60);

  return (
    <div className="space-y-8 pt-6">
      {/* Header & Track Filter */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
        <div>
          <p className="text-sm font-medium text-[#1D4ED8] mb-2">
            McKinsey PEI, Case &amp; Executive Interview Lab
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#0F172A]">
            Rehearse boardroom stories under superday timers.
          </h1>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#64748B]">
            <span className="font-mono tabular-nums">
              {Object.keys(savedStories).length} of {INTERVIEW_QUESTIONS.length} MBA stories drafted
            </span>
            <span aria-hidden="true">·</span>
            <span>PEI, Case Structuring &amp; IB Technicals</span>
            <span aria-hidden="true">·</span>
            <span>Executive delivery rubric</span>
          </div>
        </div>

        <div
          className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#EEF2F6] rounded-lg border border-[#E2E8F0] self-start lg:self-auto"
          role="tablist"
          aria-label="Filter interview prompts"
        >
          {(
            [
              { id: 'all', label: 'All Prompts' },
              { id: 'consulting', label: 'Consulting' },
              { id: 'finance', label: 'IB & Finance' },
              { id: 'product', label: 'Tech PM' },
              { id: 'operations', label: 'General Mgmt' },
            ] as { id: FilterOption; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={filter === tab.id}
              onClick={() => {
                setFilter(tab.id);
                const firstMatch =
                  tab.id === 'all'
                    ? INTERVIEW_QUESTIONS[0]
                    : INTERVIEW_QUESTIONS.find(
                        (q) => q.trackId === tab.id || q.trackId === 'general'
                      );
                if (firstMatch) setSelectedQuestionId(firstMatch.id);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab.id
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two-Zone Layout: Prompt List + Practice Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Question Selector & Story Bank (4 cols) */}
        <aside className="lg:col-span-4 space-y-3">
          <div className="text-xs font-medium text-[#64748B] px-1">
            Select a Prompt ({filteredQuestions.length})
          </div>
          <div className="space-y-2.5">
            {filteredQuestions.map((q) => {
              const selected = q.id === currentQuestion.id;
              const saved = Boolean(savedStories[q.id]);
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setSelectedQuestionId(q.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-white border-[#1D4ED8]'
                      : 'bg-white border-[#E2E8F0] hover:border-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
                    <span>{q.category}</span>
                    {saved && (
                      <span className="inline-flex items-center gap-1 font-semibold text-[#047857]">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Saved</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 text-sm font-medium text-[#0F172A] leading-snug">
                    {q.prompt}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Active Timed Simulator & STAR Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prompt & Timed Rehearsal Deck */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2 pb-5 border-b border-[#E2E8F0]">
              <div className="text-xs font-medium text-[#64748B]">
                {currentQuestion.category} ·{' '}
                {currentQuestion.trackId === 'general'
                  ? 'Core Behavioral'
                  : `${currentQuestion.trackId.charAt(0).toUpperCase() + currentQuestion.trackId.slice(1)} Track`}
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#0F172A] text-balance">
                {currentQuestion.prompt}
              </h2>
              <p className="text-sm text-[#475569]">
                <span className="font-semibold text-[#0F172A]">
                  What interviewers listen for:{' '}
                </span>
                {currentQuestion.interviewerIntent}
              </p>
            </div>

            {/* Interactive Speaking Timer */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-[#64748B]">
                    Spoken Rehearsal Timer
                  </div>
                  <div
                    className={`mt-1 text-3xl font-semibold font-mono tabular-nums ${
                      secondsLeft === 0
                        ? 'text-[#B91C1C]'
                        : secondsLeft <= 20
                        ? 'text-[#B45309]'
                        : 'text-[#0F172A]'
                    }`}
                  >
                    {formatTime(secondsLeft)}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center p-0.5 bg-white border border-[#CBD5E1] rounded-lg">
                    {[120, 180].map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => {
                          setTargetDuration(dur);
                          setSecondsLeft(dur);
                          setIsRunning(false);
                        }}
                        className={`px-2.5 py-1 text-xs font-mono rounded-md cursor-pointer ${
                          targetDuration === dur
                            ? 'bg-[#0F172A] text-white'
                            : 'text-[#475569] hover:text-[#0F172A]'
                        }`}
                      >
                        {dur / 60}m
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRunning(!isRunning)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{secondsLeft < targetDuration ? 'Resume' : 'Start Timer'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsRunning(false);
                      setSecondsLeft(targetDuration);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] rounded-lg whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="h-2 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    secondsLeft === 0
                      ? 'bg-[#DC2626]'
                      : secondsLeft <= 20
                      ? 'bg-[#D97706]'
                      : 'bg-[#1D4ED8]'
                  }`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* STAR Story Structured Draft */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Draft Your STAR Story
                </h3>
                <span className="text-xs font-mono tabular-nums text-[#64748B]">
                  {wordCount} words · ~{estSpokenSeconds}s spoken pace
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="star-s"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Situation (Brief context in 1–2 sentences)
                  </label>
                  <textarea
                    id="star-s"
                    rows={3}
                    placeholder="What project, team, or constraint set the scene?"
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="star-t"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Task (Your specific responsibility or goal)
                  </label>
                  <textarea
                    id="star-t"
                    rows={3}
                    placeholder="What outcome were you personally accountable for?"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="star-a"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Action (Concrete steps and trade-offs you made)
                  </label>
                  <textarea
                    id="star-a"
                    rows={4}
                    placeholder="Use 'I' statements: what did you analyze, build, or align?"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="star-r"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Result (Quantified impact or concrete lesson)
                  </label>
                  <textarea
                    id="star-r"
                    rows={4}
                    placeholder="What changed afterward? Include metrics, time saved, or adoption."
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-lg text-[#0F172A]"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSample(!showSample)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#0F172A] cursor-pointer py-1.5"
                >
                  {showSample ? (
                    <>
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                      <span>Hide Sample Strong Outline</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" aria-hidden="true" />
                      <span>Compare With Sample Strong Outline</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg whitespace-nowrap cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save Story to Bank</span>
                </button>
              </div>

              {showSample && (
                <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5 text-sm text-[#334155]">
                  <div className="text-xs font-semibold text-[#1D4ED8]">
                    Reference Strong STAR Outline
                  </div>
                  <p>
                    <strong className="text-[#0F172A]">Situation: </strong>
                    {currentQuestion.sampleOutline.situation}
                  </p>
                  <p>
                    <strong className="text-[#0F172A]">Task: </strong>
                    {currentQuestion.sampleOutline.task}
                  </p>
                  <p>
                    <strong className="text-[#0F172A]">Action: </strong>
                    {currentQuestion.sampleOutline.action}
                  </p>
                  <p>
                    <strong className="text-[#0F172A]">Result: </strong>
                    {currentQuestion.sampleOutline.result}
                  </p>
                </div>
              )}
            </div>

            {/* Self-Review Rubric */}
            <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Post-Delivery Self-Review Rubric
                </h3>
                <span className="text-xs font-mono tabular-nums text-[#64748B]">
                  {checkedRubric.length} / {INTERVIEW_RUBRIC.length} met
                </span>
              </div>
              <div className="space-y-2">
                {INTERVIEW_RUBRIC.map((criterion, idx) => {
                  const checked = checkedRubric.includes(idx);
                  return (
                    <button
                      key={criterion}
                      type="button"
                      onClick={() => toggleRubricIndex(idx)}
                      className="w-full text-left flex items-start gap-2.5 py-1.5 text-sm text-[#334155] hover:text-[#0F172A] cursor-pointer"
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
                      <span>{criterion}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
