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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-card p-6 md:p-8">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Which subjects are most important for your future studies?</h2>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSubject(importantSubjects, setImportantSubjects, s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    importantSubjects.includes(s)
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">When do you feel most productive?</h2>
            <div className="grid grid-cols-3 gap-3">
              {([["🌅", "Morning"], ["☀️", "Afternoon"], ["🌙", "Evening"]] as const).map(([icon, t]) => (
                <button
                  key={t}
                  onClick={() => setPeakTime(t)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                    peakTime === t
                      ? "border-primary bg-secondary shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <span className="text-3xl">{icon}</span>
                  <span className="font-semibold text-foreground">{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Which study style do you prefer?</h2>
            <div className="grid gap-3">
              {(["Short focused bursts", "Long deep work sessions"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStudyStyle(s)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    studyStyle === s
                      ? "border-primary bg-secondary shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <span className="font-semibold text-foreground">{s === "Short focused bursts" ? "⚡" : "🧠"} {s}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Which subjects do you find hardest to start?</h2>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSubject(hardestSubjects, setHardestSubjects, s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    hardestSubjects.includes(s)
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Choose your productivity mode</h2>
            <div className="grid gap-3">
              {([
                ["Flexible", "🟢", "Frequent adjustments, shorter blocks, more breaks"],
                ["Balanced", "🟡", "Moderate structure, auto-adjustments if tasks are missed"],
                ["Strict", "🔴", "Minimal changes, high priority enforcement, reminders"],
              ] as const).map(([m, dot, desc]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`text-left p-5 rounded-2xl border-2 transition-all ${
                    mode === m
                      ? "border-primary bg-secondary shadow-md"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>{dot}</span>
                    <span className="font-bold text-foreground">{m}</span>
                    <span className="text-2xl ml-auto">{MODE_EMOJI[m]}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
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
              className="px-6 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground disabled:opacity-40 transition-all shadow-md hover:shadow-lg"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!canNext()}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground disabled:opacity-40 transition-all shadow-md hover:shadow-lg"
            >
              Complete Setup ✨
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
