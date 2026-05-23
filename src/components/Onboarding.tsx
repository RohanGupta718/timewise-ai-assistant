import { useState } from "react";
import {
  SUBJECTS, Subject, PeakTime, FocusDuration, StartTiming, StudyOrganization,
  ReadinessDelay, DifficultApproach, MissedSessions, StudyBlocker, PlanControl,
  StudentProfile,
} from "@/types/timewise";

interface Props {
  onComplete: (profile: StudentProfile) => void;
}

interface QuestionOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface SingleQuestion<T extends string> {
  type: "single";
  title: string;
  subtitle: string;
  options: QuestionOption<T>[];
}

interface MultiQuestion {
  type: "multi";
  title: string;
  subtitle: string;
  maxSelect: number;
  options: string[];
}

type Question = SingleQuestion<string> | MultiQuestion;

const QUESTIONS: Question[] = [
  {
    type: "single",
    title: "How long can you usually focus before needing a break?",
    subtitle: "This helps us set the right session length for you",
    options: [
      { value: "under20", label: "Under 20 minutes", description: "Short bursts work best" },
      { value: "20to35", label: "20–35 minutes", description: "Solid focus window" },
      { value: "35to60", label: "35–60 minutes", description: "Strong concentration" },
      { value: "over60", label: "Over 60 minutes", description: "Deep work champion" },
    ],
  },
  {
    type: "single",
    title: "How far in advance do you usually start working on an assignment?",
    subtitle: "We'll plan your workload around your natural habits",
    options: [
      { value: "dayBefore", label: "The day before (or day of)" },
      { value: "2to3days", label: "2–3 days before" },
      { value: "aboutWeek", label: "About a week before" },
      { value: "immediately", label: "As soon as it's assigned" },
    ],
  },
  {
    type: "single",
    title: "When you sit down to study, how do you prefer to organise your time?",
    subtitle: "This shapes how we sequence your tasks",
    options: [
      { value: "oneSubject", label: "One subject all the way through" },
      { value: "switchSubjects", label: "Switch between subjects to stay fresh" },
      { value: "mostUrgent", label: "Tackle whatever feels most urgent" },
      { value: "noApproach", label: "I don't have a consistent approach" },
    ],
  },
  {
    type: "single",
    title: "When do you feel most alert and focused for studying?",
    subtitle: "We'll schedule your hardest work during your peak hours",
    options: [
      { value: "Morning", label: "🌅 Morning", description: "Before noon" },
      { value: "Afternoon", label: "☀️ Afternoon", description: "12–5 pm" },
      { value: "Evening", label: "🌙 Evening", description: "5–9 pm" },
      { value: "Late Night", label: "🦉 Late Night", description: "After 9 pm" },
    ],
  },
  {
    type: "single",
    title: "After school, how long do you usually need before you feel ready to study?",
    subtitle: "We'll build in the right buffer time",
    options: [
      { value: "immediate", label: "I'm ready almost immediately" },
      { value: "15to30min", label: "About 15–30 minutes" },
      { value: "aboutHour", label: "About an hour" },
      { value: "rarelyReady", label: "I'm rarely ready after school" },
    ],
  },
  {
    type: "single",
    title: "When you have a difficult assignment, what do you usually do first?",
    subtitle: "Helps us understand how to structure challenging tasks",
    options: [
      { value: "startImmediately", label: "Start it straight away" },
      { value: "startThenStop", label: "Start it but then stop after a while" },
      { value: "easierFirst", label: "Do easier tasks first, then come back" },
      { value: "putOff", label: "Put it off until close to the deadline" },
    ],
  },
  {
    type: "single",
    title: "How often do you miss or skip a planned study session?",
    subtitle: "No judgement — this helps us calibrate reminders",
    options: [
      { value: "rarely", label: "Rarely — I usually follow through" },
      { value: "onceWeek", label: "Once a week or so" },
      { value: "severalWeek", label: "Several times a week" },
      { value: "mostDays", label: "Most days — plans rarely stick" },
    ],
  },
  {
    type: "single",
    title: "What's the main thing that stops you from starting to study?",
    subtitle: "We'll design strategies to tackle your biggest blocker",
    options: [
      { value: "dontKnowStart", label: "I don't know where to start" },
      { value: "tooLarge", label: "The task feels too large or overwhelming" },
      { value: "distracted", label: "I get distracted easily" },
      { value: "unmotivated", label: "I feel unmotivated or low energy" },
    ],
  },
  {
    type: "multi",
    title: "Which subjects matter most for your plans after school?",
    subtitle: "Select up to 3 — these will get higher priority",
    maxSelect: 3,
    options: [...SUBJECTS],
  },
  {
    type: "multi",
    title: "Which subjects do you tend to avoid or find hardest to begin?",
    subtitle: "Select up to 2 — we'll give these an extra push",
    maxSelect: 2,
    options: [...SUBJECTS],
  },
  {
    type: "single",
    title: "How much control do you want over your study plan?",
    subtitle: "This sets how your schedule is generated",
    options: [
      { value: "tellMe", label: "Tell me exactly what to do", description: "I'll follow it" },
      { value: "planAdjust", label: "Give me a plan but let me adjust it", description: "Guided flexibility" },
      { value: "suggest", label: "Just suggest — I'll decide what to do", description: "Light guidance" },
      { value: "planMyself", label: "I prefer to plan myself", description: "Full control" },
    ],
  },
];

const SINGLE_KEYS: string[] = [
  "focusDuration", "startTiming", "studyOrganization", "peakTime",
  "readinessDelay", "difficultApproach", "missedSessions", "studyBlocker",
  // skip 8,9 (multi), then 10:
];

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [singleAnswers, setSingleAnswers] = useState<Record<number, string>>({});
  const [importantSubjects, setImportantSubjects] = useState<Subject[]>([]);
  const [hardestSubjects, setHardestSubjects] = useState<Subject[]>([]);

  const totalSteps = QUESTIONS.length;
  const progress = ((step + 1) / totalSteps) * 100;
  const q = QUESTIONS[step];

  const canNext = () => {
    if (q.type === "single") return !!singleAnswers[step];
    if (step === 8) return importantSubjects.length > 0;
    if (step === 9) return hardestSubjects.length > 0;
    return false;
  };

  const toggleMulti = (list: Subject[], setList: React.Dispatch<React.SetStateAction<Subject[]>>, s: Subject, max: number) => {
    if (list.includes(s)) {
      setList(list.filter((x) => x !== s));
    } else if (list.length < max) {
      setList([...list, s]);
    }
  };

  const handleFinish = () => {
    const profile: StudentProfile = {
      focusDuration: singleAnswers[0] as FocusDuration,
      startTiming: singleAnswers[1] as StartTiming,
      studyOrganization: singleAnswers[2] as StudyOrganization,
      peakTime: singleAnswers[3] as PeakTime,
      readinessDelay: singleAnswers[4] as ReadinessDelay,
      difficultApproach: singleAnswers[5] as DifficultApproach,
      missedSessions: singleAnswers[6] as MissedSessions,
      studyBlocker: singleAnswers[7] as StudyBlocker,
      importantSubjects,
      hardestSubjects,
      planControl: singleAnswers[10] as PlanControl,
    };
    onComplete(profile);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="font-display font-semibold text-foreground">Question {step + 1} of {totalSteps}</span>
          <span className="text-muted-foreground font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500 ease-out shadow-glow" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-card/95 rounded-2xl shadow-card border-glow p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-gradient mb-1">{q.title}</h2>
          <p className="text-sm text-muted-foreground">{q.subtitle}</p>
        </div>

        {q.type === "single" && (
          <div className="grid gap-2.5">
            {(q as SingleQuestion<string>).options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSingleAnswers((prev) => ({ ...prev, [step]: opt.value }))}
                className={`text-left p-4 rounded-2xl transition-all card-hover ${
                  singleAnswers[step] === opt.value
                    ? "border-glow-active bg-accent/20 shadow-glow"
                    : "border-glow bg-card hover:bg-secondary"
                }`}
              >
                <span className="font-display font-semibold text-foreground">{opt.label}</span>
                {opt.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">{opt.description}</p>
                )}
              </button>
            ))}
          </div>
        )}

        {q.type === "multi" && (
          <div className="flex flex-wrap gap-2.5">
            {(q as MultiQuestion).options.map((s) => {
              const list = step === 8 ? importantSubjects : hardestSubjects;
              const setList = step === 8 ? setImportantSubjects : setHardestSubjects;
              const max = (q as MultiQuestion).maxSelect;
              return (
                <button
                  key={s}
                  onClick={() => toggleMulti(list, setList, s as Subject, max)}
                  className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                    list.includes(s as Subject)
                      ? "gradient-primary text-primary-foreground shadow-glow border-transparent"
                      : "bg-secondary text-secondary-foreground border-glow hover:border-glow-active hover:bg-muted"
                  }`}
                >
                  {s}
                </button>
              );
            })}
            <p className="w-full text-xs text-muted-foreground mt-1">
              {step === 8
                ? `${importantSubjects.length}/3 selected`
                : `${hardestSubjects.length}/2 selected`}
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-0 transition-all"
          >
            ← Back
          </button>
          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="px-7 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground disabled:opacity-40 transition-all shadow-glow hover:shadow-card-hover"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canNext()}
              className="px-7 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground disabled:opacity-40 transition-all shadow-glow hover:shadow-card-hover"
            >
              Complete Setup ✨
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
