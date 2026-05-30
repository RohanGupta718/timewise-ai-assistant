export const SUBJECTS = ["Mathematics", "Sciences", "English", "Humanities", "Computer Science", "Arts & Commerce"] as const;
export type Subject = typeof SUBJECTS[number];

export type FocusDuration = "under20" | "20to35" | "35to60" | "over60";
export type StartTiming = "dayBefore" | "2to3days" | "aboutWeek" | "immediately";
export type StudyOrganization = "oneSubject" | "switchSubjects" | "mostUrgent" | "noApproach";
export type PeakTime = "Morning" | "Afternoon" | "Evening" | "Late Night";
export type ReadinessDelay = "immediate" | "15to30min" | "aboutHour" | "rarelyReady";
export type DifficultApproach = "startImmediately" | "startThenStop" | "easierFirst" | "putOff";
export type MissedSessions = "rarely" | "onceWeek" | "severalWeek" | "mostDays";
export type StudyBlocker = "dontKnowStart" | "tooLarge" | "distracted" | "unmotivated";
export type PlanControl = "tellMe" | "planAdjust" | "suggest" | "planMyself";

export type Difficulty = "Low" | "Medium" | "High";

export interface StudentProfile {
  focusDuration: FocusDuration;
  startTiming: StartTiming;
  studyOrganization: StudyOrganization;
  peakTime: PeakTime;
  readinessDelay: ReadinessDelay;
  difficultApproach: DifficultApproach;
  missedSessions: MissedSessions;
  studyBlocker: StudyBlocker;
  importantSubjects: Subject[];
  hardestSubjects: Subject[];
  planControl: PlanControl;
}

export interface Assignment {
  id: string;
  subject: Subject;
  name: string;
  deadline: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  documentUrl?: string;
  documentName?: string;
  documentPath?: string;
  documentContentType?: string;
}

export interface Task {
  id: string;
  assignmentId: string;
  name: string;
  subject: Subject;
  deadline: string;
  difficulty: Difficulty;
  durationMinutes: number;
  priorityScore: number;
  delayPenalty: number;
  completed: boolean;
}

export const SUBJECT_KEY: Record<Subject, string> = {
  Mathematics: "math",
  Sciences: "sciences",
  English: "english",
  Humanities: "humanities",
  "Computer Science": "cs",
  "Arts & Commerce": "arts",
};

export const ESTIMATED_TIMES = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr", value: 60 },
  { label: "1.5 hr", value: 90 },
  { label: "2 hr", value: 120 },
];

export const PLAN_CONTROL_LABELS: Record<PlanControl, string> = {
  tellMe: "Strict",
  planAdjust: "Guided",
  suggest: "Flexible",
  planMyself: "Self-directed",
};

export const PLAN_CONTROL_EMOJI: Record<PlanControl, string> = {
  tellMe: "💪",
  planAdjust: "🎯",
  suggest: "😊",
  planMyself: "🧭",
};

export const PEAK_START: Record<PeakTime, string> = {
  Morning: "7:00 AM",
  Afternoon: "12:00 PM",
  Evening: "5:00 PM",
  "Late Night": "9:00 PM",
};

export const PEAK_START_HOUR: Record<PeakTime, number> = {
  Morning: 7,
  Afternoon: 12,
  Evening: 17,
  "Late Night": 21,
};
