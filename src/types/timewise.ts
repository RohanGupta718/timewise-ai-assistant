export const SUBJECTS = ["Math", "Physics", "Biology", "Chemistry", "Computer Science", "English", "History", "Other"] as const;
export type Subject = typeof SUBJECTS[number];

export type PeakTime = "Morning" | "Afternoon" | "Evening";
export type StudyStyle = "Short focused bursts" | "Long deep work sessions";
export type ProductivityMode = "Flexible" | "Balanced" | "Strict";
export type Difficulty = "Low" | "Medium" | "High";

export interface StudentProfile {
  importantSubjects: Subject[];
  peakTime: PeakTime;
  studyStyle: StudyStyle;
  hardestSubjects: Subject[];
  mode: ProductivityMode;
}

export interface Assignment {
  id: string;
  subject: Subject;
  name: string;
  deadline: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
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
  Math: "math",
  Physics: "physics",
  Biology: "biology",
  Chemistry: "chemistry",
  "Computer Science": "cs",
  English: "english",
  History: "history",
  Other: "other",
};

export const ESTIMATED_TIMES = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hr", value: 60 },
  { label: "1.5 hr", value: 90 },
  { label: "2 hr", value: 120 },
];

export const MODE_EMOJI: Record<ProductivityMode, string> = {
  Flexible: "😊",
  Balanced: "🎯",
  Strict: "💪",
};

export const PEAK_START: Record<PeakTime, string> = {
  Morning: "7:00 AM",
  Afternoon: "2:00 PM",
  Evening: "5:00 PM",
};

export const PEAK_START_HOUR: Record<PeakTime, number> = {
  Morning: 7,
  Afternoon: 14,
  Evening: 17,
};
