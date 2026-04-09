import { useState } from "react";
import { SUBJECTS, Subject, PeakTime, StudyStyle, ProductivityMode, StudentProfile, MODE_EMOJI } from "@/types/timewise";

interface Props {
  onComplete: (profile: StudentProfile) => void;
}

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [importantSubjects, setImportantSubjects] = useState<Subject[]>([]);
  const [peakTime, setPeakTime] = useState<PeakTime | null>(null);
  const [studyStyle, setStudyStyle] = useState<StudyStyle | null>(null);
  const [hardestSubjects, setHardestSubjects] = useState<Subject[]>([]);
  const [mode, setMode] = useState<ProductivityMode | null>(null);

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const toggleSubject = (list: Subject[], setList: React.Dispatch<React.SetStateAction<Subject[]>>, s: Subject) => {
    setList(list.includes(s) ? list.filter((x) => x !== s) : [...list, s]);
  };

  const canNext = () => {
    if (step === 0) return importantSubjects.length > 0;
    if (step === 1) return peakTime !== null;
    if (step === 2) return studyStyle !== null;
    if (step === 3) return hardestSubjects.length > 0;
    if (step === 4) return mode !== null;
    return false;
  };

  const handleFinish = () => {
    if (peakTime && studyStyle && mode) {
      onComplete({ importantSubjects, peakTime, studyStyle, hardestSubjects, mode });
    }
  };

  const stepTitles = [
    "Which subjects matter most for your future?",
    "When do you feel most productive?",
    "What's your preferred study style?",
    "Which subjects are hardest to start?",
    "Choose your productivity mode",
  ];

  const stepSubtitles = [
    "Select all that apply — this helps us prioritize your tasks",
    "We'll schedule your most important work during this window",
    "This shapes how we break down your study sessions",
    "We'll give these subjects an extra push when scheduling",
    "This controls how aggressively we adjust your plan",
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="font-display font-semibold text-foreground">Step {step + 1} of {totalSteps}</span>
          <span className="text-muted-foreground font-medium">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500 ease-out shadow-glow" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card border-glow p-6 sm:p-8">
        {/* Dynamic header */}
        <div className="mb-6">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-gradient mb-1">{stepTitles[step]}</h2>
          <p className="text-sm text-muted-foreground">{stepSubtitles[step]}</p>
        </div>

        {step === 0 && (
          <div className="flex flex-wrap gap-2.5">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => toggleSubject(importantSubjects, setImportantSubjects, s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  importantSubjects.includes(s)
                    ? "gradient-primary text-primary-foreground shadow-glow border-transparent"
                    : "bg-secondary text-secondary-foreground border-glow hover:border-glow-active hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-3 gap-3">
            {([["🌅", "Morning"], ["☀️", "Afternoon"], ["🌙", "Evening"]] as const).map(([icon, t]) => (
              <button
                key={t}
                onClick={() => setPeakTime(t)}
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl transition-all card-hover ${
                  peakTime === t
                    ? "border-glow-active bg-accent/20 shadow-glow"
                    : "border-glow bg-card hover:bg-secondary"
                }`}
              >
                <span className="text-4xl">{icon}</span>
                <span className="font-display font-semibold text-foreground">{t}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-3">
            {(["Short focused bursts", "Long deep work sessions"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStudyStyle(s)}
                className={`text-left p-5 rounded-2xl transition-all card-hover ${
                  studyStyle === s
                    ? "border-glow-active bg-accent/20 shadow-glow"
                    : "border-glow bg-card hover:bg-secondary"
                }`}
              >
                <span className="font-display font-semibold text-foreground">{s === "Short focused bursts" ? "⚡" : "🧠"} {s}</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {s === "Short focused bursts" ? "25-minute Pomodoro-style sessions with breaks" : "90+ minute deep focus blocks for complex work"}
                </p>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-wrap gap-2.5">
            {SUBJECTS.map((s) => (
              <button
                key={s}
                onClick={() => toggleSubject(hardestSubjects, setHardestSubjects, s)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  hardestSubjects.includes(s)
                    ? "gradient-primary text-primary-foreground shadow-glow border-transparent"
                    : "bg-secondary text-secondary-foreground border-glow hover:border-glow-active hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-3">
            {([
              ["Flexible", "🟢", "Frequent adjustments, shorter blocks, more breaks"],
              ["Balanced", "🟡", "Moderate structure, auto-adjustments if tasks are missed"],
              ["Strict", "🔴", "Minimal changes, high priority enforcement, reminders"],
            ] as const).map(([m, dot, desc]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`text-left p-5 rounded-2xl transition-all card-hover ${
                  mode === m
                    ? "border-glow-active bg-accent/20 shadow-glow"
                    : "border-glow bg-card hover:bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{dot}</span>
                  <span className="font-display font-bold text-foreground">{m}</span>
                  <span className="text-2xl ml-auto">{MODE_EMOJI[m]}</span>
                </div>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </button>
            ))}
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
