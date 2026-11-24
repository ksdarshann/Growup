import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DEFAULT_RESUME_DATA } from './data/careerData';
import {
  ResumeData,
  SavedInterviewStory,
  TrackId,
  UserProgressState,
  WorkspaceTab,
} from './types';
import { OverviewSection } from './components/OverviewSection';
import { TracksWorkspace } from './components/TracksWorkspace';
import { PracticeLab } from './components/PracticeLab';
import { ResumeStudio } from './components/ResumeStudio';
import { InterviewStudio } from './components/InterviewStudio';

const STORAGE_KEY = 'craftpath_mba_progress_v1';

const INITIAL_PROGRESS: UserProgressState = {
  activeTrackId: 'consulting',
  weeklyHours: 10,
  diagnosticCompleted: false,
  completedModuleIds: [],
  checkedSubSkills: [],
  checkedDeliverables: [],
  passedPracticeMissions: [],
  resume: DEFAULT_RESUME_DATA,
  interviewStories: {},
};

const NAV_ITEMS: { id: WorkspaceTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'tracks', label: 'Tracks' },
  { id: 'practice', label: 'Practice Lab' },
  { id: 'resume', label: 'Resume Studio' },
  { id: 'interview', label: 'Interview Prep' },
];

function loadSavedProgress(): UserProgressState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<UserProgressState>;
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
      resume: {
        ...DEFAULT_RESUME_DATA,
        ...(parsed.resume || {}),
      },
      interviewStories: parsed.interviewStories || {},
    };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState<UserProgressState>(() =>
    loadSavedProgress()
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota errors gracefully
    }
  }, [progress]);

  useEffect(() => {
    if (!toastMessage) return;
    const id = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(id);
  }, [toastMessage]);

  const notify = (msg: string) => setToastMessage(msg);

  const navigateTo = (tab: WorkspaceTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTrack = (
    trackId: TrackId,
    weeklyHours?: number,
    markDiagnostic?: boolean
  ) => {
    setProgress((prev) => ({
      ...prev,
      activeTrackId: trackId,
      weeklyHours: weeklyHours ?? prev.weeklyHours,
      diagnosticCompleted: markDiagnostic ? true : prev.diagnosticCompleted,
    }));
  };

  const handleOpenTrack = (trackId: TrackId) => {
    handleSelectTrack(trackId);
    navigateTo('tracks');
  };

  const handleToggleModuleComplete = (moduleId: string) => {
    setProgress((prev) => {
      const exists = prev.completedModuleIds.includes(moduleId);
      const next = exists
        ? prev.completedModuleIds.filter((id) => id !== moduleId)
        : [...prev.completedModuleIds, moduleId];
      notify(exists ? 'Stage marked as in progress.' : 'Stage completed and saved.');
      return { ...prev, completedModuleIds: next };
    });
  };

  const handleToggleSubSkill = (skillKey: string) => {
    setProgress((prev) => {
      const exists = prev.checkedSubSkills.includes(skillKey);
      return {
        ...prev,
        checkedSubSkills: exists
          ? prev.checkedSubSkills.filter((k) => k !== skillKey)
          : [...prev.checkedSubSkills, skillKey],
      };
    });
  };

  const handleToggleDeliverable = (deliverableKey: string) => {
    setProgress((prev) => {
      const exists = prev.checkedDeliverables.includes(deliverableKey);
      return {
        ...prev,
        checkedDeliverables: exists
          ? prev.checkedDeliverables.filter((k) => k !== deliverableKey)
          : [...prev.checkedDeliverables, deliverableKey],
      };
    });
  };

  const handlePassMission = (missionId: string) => {
    setProgress((prev) => {
      if (prev.passedPracticeMissions.includes(missionId)) return prev;
      notify('Practice mission verified and recorded.');
      return {
        ...prev,
        passedPracticeMissions: [...prev.passedPracticeMissions, missionId],
      };
    });
  };

  const handleUpdateResume = (nextResume: ResumeData) => {
    setProgress((prev) => ({ ...prev, resume: nextResume }));
  };

  const handleSaveInterviewStory = (story: SavedInterviewStory) => {
    setProgress((prev) => ({
      ...prev,
      interviewStories: {
        ...prev.interviewStories,
        [story.questionId]: story,
      },
    }));
  };

  const handleResetProgress = () => {
    setProgress(INITIAL_PROGRESS);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    notify('Local progress reset to defaults.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8FA] text-[#0F172A]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="no-print sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xs border-b border-[#E2E8F0]">
        <div className="max-w-[1280px] h-full mx-auto px-6 lg:px-10 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigateTo('overview')}
            className="font-display text-xl font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Craftpath
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigateTo(item.id)}
                  className={`py-1 text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'text-[#0F172A] border-[#1D4ED8]'
                      : 'text-[#475569] border-transparent hover:text-[#0F172A] hover:border-[#CBD5E1]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action (plus mobile menu toggle on small screens) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                navigateTo(activeTab === 'tracks' ? 'practice' : 'tracks')
              }
              className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {activeTab === 'tracks'
                ? 'Open Practice Lab'
                : progress.completedModuleIds.length > 0
                ? 'Continue Track'
                : 'Start Learning'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="no-print md:hidden bg-white border-b border-[#E2E8F0] px-6 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer ${
                  active
                    ? 'bg-[#EFF6FF] text-[#1D4ED8]'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 lg:px-10 pb-20">
        {activeTab === 'overview' && (
          <OverviewSection
            progress={progress}
            onSelectTrack={handleSelectTrack}
            onNavigate={navigateTo}
            onOpenTrack={handleOpenTrack}
          />
        )}

        {activeTab === 'tracks' && (
          <TracksWorkspace
            progress={progress}
            onSelectTrack={(id) => handleSelectTrack(id)}
            onUpdateWeeklyHours={(hours) =>
              setProgress((prev) => ({ ...prev, weeklyHours: hours }))
            }
            onToggleModuleComplete={handleToggleModuleComplete}
            onToggleSubSkill={handleToggleSubSkill}
            onToggleDeliverable={handleToggleDeliverable}
            onNavigate={navigateTo}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeLab
            defaultTrackId={progress.activeTrackId}
            passedMissions={progress.passedPracticeMissions}
            onPassMission={handlePassMission}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeStudio
            resume={progress.resume}
            activeTrackId={progress.activeTrackId}
            onUpdateResume={handleUpdateResume}
            onNotify={notify}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewStudio
            activeTrackId={progress.activeTrackId}
            savedStories={progress.interviewStories}
            onSaveStory={handleSaveInterviewStory}
            onNotify={notify}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="no-print border-t border-[#E2E8F0] bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#64748B]">
          <div>
            Craftpath — Post-MBA career roadmaps, case &amp; valuation labs, and executive interview prep.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo('tracks')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Roadmaps
            </button>
            <button
              type="button"
              onClick={() => navigateTo('practice')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Practice Lab
            </button>
            <button
              type="button"
              onClick={() => navigateTo('resume')}
              className="hover:text-[#0F172A] cursor-pointer"
            >
              Resume Studio
            </button>
            <button
              type="button"
              onClick={handleResetProgress}
              className="hover:text-[#B91C1C] cursor-pointer"
            >
              Reset local progress
            </button>
          </div>
        </div>
      </footer>

      {/* Quiet Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="no-print fixed bottom-6 right-6 z-40 px-4 py-3 rounded-lg bg-[#0F172A] text-white text-xs font-medium shadow-md"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
