export type WorkspaceTab =
  | 'overview'
  | 'tracks'
  | 'practice'
  | 'resume'
  | 'interview';

export type TrackId = 'consulting' | 'finance' | 'product' | 'operations';

export interface ConceptSlider {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface ModuleConceptModel {
  title: string;
  prompt: string;
  sliders: ConceptSlider[];
  formulaLabel: string;
  evaluate: (values: Record<string, number>) => {
    primaryMetricLabel: string;
    primaryMetricValue: string;
    secondaryMetricLabel: string;
    secondaryMetricValue: string;
    status: 'nominal' | 'caution' | 'critical';
    statusLabel: string;
    insight: string;
  };
}

export interface MasteryQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TrackModule {
  id: string;
  stageNumber: number;
  title: string;
  durationHours: number;
  summary: string;
  keyTakeaways: string[];
  subSkills: string[];
  conceptModel: ModuleConceptModel;
  masteryQuestion: MasteryQuestion;
}

export interface CareerTrack {
  id: TrackId;
  title: string;
  shortTitle: string;
  tagline: string;
  image: string;
  imageAlt: string;
  totalHours: number;
  salaryBand: string;
  levelRange: string;
  coreTools: string[];
  portfolioBrief: {
    title: string;
    summary: string;
    deliverables: string[];
  };
  recommendedSkills: string[];
  modules: TrackModule[];
}

export interface ResumeExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  bullets: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  context: string;
  summary: string;
}

export interface ResumeData {
  fullName: string;
  targetRole: string;
  location: string;
  email: string;
  portfolioUrl: string;
  summary: string;
  skills: string[];
  experiences: ResumeExperience[];
  projects: ResumeProject[];
}

export interface InterviewQuestion {
  id: string;
  trackId: TrackId | 'general';
  category: string;
  prompt: string;
  interviewerIntent: string;
  sampleOutline: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
}

export interface SavedInterviewStory {
  questionId: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  checkedRubric: number[];
  updatedAt: string;
}

export interface UserProgressState {
  activeTrackId: TrackId;
  weeklyHours: number;
  diagnosticCompleted: boolean;
  completedModuleIds: string[];
  checkedSubSkills: string[];
  checkedDeliverables: string[];
  passedPracticeMissions: string[];
  resume: ResumeData;
  interviewStories: Record<string, SavedInterviewStory>;
}
