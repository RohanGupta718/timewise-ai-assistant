import { useState, useCallback } from "react";
import { StudentProfile, Assignment, Task } from "@/types/timewise";
import { Onboarding } from "@/components/Onboarding";
import { Assignments, computePriority } from "@/components/Assignments";
import { Dashboard } from "@/components/Dashboard";
import { NextTask } from "@/components/NextTask";
import { BookOpen, LayoutDashboard, Sparkles, ClipboardList } from "lucide-react";
import logo from "@/assets/logo.png";

type Tab = "onboarding" | "assignments" | "dashboard" | "next";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "onboarding", label: "Setup", icon: <Sparkles size={16} /> },
  { id: "assignments", label: "Assignments", icon: <ClipboardList size={16} /> },
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "next", label: "Next Task", icon: <BookOpen size={16} /> },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("onboarding");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  const handleOnboardingComplete = useCallback((p: StudentProfile) => {
    setProfile(p);
    setTab("assignments");
  }, []);

  const handleAddAssignment = useCallback((a: Assignment, newTasks: Task[]) => {
    setAssignments((prev) => [...prev, a]);
    setTasks((prev) => [...prev, ...newTasks]);
  }, []);

  const handleDeleteAssignment = useCallback((id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setTasks((prev) => prev.filter((t) => t.assignmentId !== id));
  }, []);

  const recalcScores = useCallback((taskList: Task[]) => {
    if (!profile) return taskList;
    return taskList.map((t) => ({
      ...t,
      priorityScore: computePriority(t.deadline, t.difficulty, t.subject, t.delayPenalty, profile.importantSubjects),
    }));
  }, [profile]);

  const handleComplete = useCallback((taskId: string) => {
    setTasks((prev) => recalcScores(prev.map((t) => t.id === taskId ? { ...t, completed: true } : t)));
    setCompletedCount((c) => c + 1);
  }, [recalcScores]);

  const handleSkip = useCallback((taskId: string) => {
    setTasks((prev) =>
      recalcScores(prev.map((t) => t.id === taskId ? { ...t, delayPenalty: t.delayPenalty + 2 } : t))
    );
  }, [recalcScores]);

  const hasAssignments = assignments.length > 0;
  const isDisabled = (id: Tab) => !profile && id !== "onboarding" || (!hasAssignments && (id === "dashboard" || id === "next"));

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 glass shadow-nav">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center h-16">
          <span className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight text-foreground mr-8 shrink-0">
            <img src={logo} alt="TimeWise" className="h-9 w-9 rounded-xl shadow-sm" />
            TimeWise
          </span>
          <nav className="flex gap-1 overflow-x-auto ml-auto">
            {NAV_ITEMS.map((item) => {
              const disabled = isDisabled(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => !disabled && setTab(item.id)}
                  disabled={disabled}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    tab === item.id
                      ? "gradient-primary text-primary-foreground shadow-md"
                      : disabled
                      ? "text-muted-foreground/40 cursor-not-allowed"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {tab === "onboarding" && (
          profile ? (
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="bg-card rounded-2xl shadow-card p-10">
                <p className="text-5xl mb-5">{profile.mode === "Flexible" ? "😊" : profile.mode === "Balanced" ? "🎯" : "💪"}</p>
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">Profile Complete!</h2>
                <p className="text-muted-foreground text-sm mb-6">You're all set. Head to Assignments to get started.</p>
                <button onClick={() => setTab("assignments")} className="gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all">
                  Go to Assignments →
                </button>
              </div>
            </div>
          ) : (
            <Onboarding onComplete={handleOnboardingComplete} />
          )
        )}
        {tab === "assignments" && profile && (
          <Assignments
            profile={profile}
            assignments={assignments}
            tasks={tasks}
            onAddAssignment={handleAddAssignment}
            onDeleteAssignment={handleDeleteAssignment}
          />
        )}
        {tab === "dashboard" && profile && (
          <Dashboard profile={profile} tasks={tasks} completedCount={completedCount} />
        )}
        {tab === "next" && profile && (
          <NextTask profile={profile} tasks={tasks} onComplete={handleComplete} onSkip={handleSkip} />
        )}
      </main>
    </div>
  );
}
