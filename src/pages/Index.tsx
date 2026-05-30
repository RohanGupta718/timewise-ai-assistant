import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StudentProfile, Assignment, Task, PLAN_CONTROL_EMOJI } from "@/types/timewise";
import { Onboarding } from "@/components/Onboarding";
import { Assignments, computePriority } from "@/components/Assignments";
import { Dashboard } from "@/components/Dashboard";
import { NextTask } from "@/components/NextTask";
import { PageBackground } from "@/components/PageBackground";
import { BookOpen, LayoutDashboard, Sparkles, ClipboardList } from "lucide-react";
import logo from "@/assets/logo.png";
import { auth, db } from "@/lib/firebase";
import { deleteAssignmentDocument } from "@/lib/assignmentDocuments";
import { isAdmin } from "@/lib/admin";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

type Tab = "onboarding" | "assignments" | "dashboard" | "next";

interface PersistedUserData {
  profile: StudentProfile | null;
  assignments: Assignment[];
  tasks: Task[];
  completedCount: number;
}

const NAV_ITEMS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "onboarding", label: "Setup", icon: <Sparkles size={16} /> },
  { id: "assignments", label: "Assignments", icon: <ClipboardList size={16} /> },
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "next", label: "Next Task", icon: <BookOpen size={16} /> },
];

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [hasLoadedData, setHasLoadedData] = useState(false);
  const [tab, setTab] = useState<Tab>("onboarding");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [nextTaskStarted, setNextTaskStarted] = useState(false);
  const [deferredTaskIds, setDeferredTaskIds] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setHasLoadedData(false);
      return;
    }

    const loadData = async () => {
      setIsDataLoading(true);
      setHasLoadedData(false);
      try {
        const userDocRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userDocRef);

        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<PersistedUserData>;
          setProfile((data.profile as StudentProfile | null) ?? null);
          setAssignments((data.assignments as Assignment[]) ?? []);
          setTasks((data.tasks as Task[]) ?? []);
          setCompletedCount(typeof data.completedCount === "number" ? data.completedCount : 0);
          setNextTaskStarted(false);
          setDeferredTaskIds([]);
          setTab(((data.profile as StudentProfile | null) ? "assignments" : "onboarding"));
        } else {
          setProfile(null);
          setAssignments([]);
          setTasks([]);
          setCompletedCount(0);
          setNextTaskStarted(false);
          setDeferredTaskIds([]);
          setTab("onboarding");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setHasLoadedData(true);
        setIsDataLoading(false);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    if (!user || !hasLoadedData) return;

    const saveData = async () => {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          profile,
          assignments,
          tasks,
          completedCount,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to save user data:", error);
      }
    };

    saveData();
  }, [user, hasLoadedData, profile, assignments, tasks, completedCount]);

  const handleOnboardingComplete = useCallback((p: StudentProfile) => {
    setProfile(p);
    setTab("assignments");
  }, []);

  const handleAddAssignment = useCallback((a: Assignment, newTasks: Task[]) => {
    setAssignments((prev) => [...prev, a]);
    setTasks((prev) => [...prev, ...newTasks]);
  }, []);

  const handleDeleteAssignment = useCallback(async (id: string) => {
    const assignment = assignments.find((a) => a.id === id);
    if (assignment?.documentPath) {
      try {
        await deleteAssignmentDocument(assignment.documentPath);
      } catch (error) {
        console.error("Failed to delete assignment document:", error);
      }
    }
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setTasks((prev) => prev.filter((t) => t.assignmentId !== id));
  }, [assignments]);

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

  const handleEndTasks = useCallback(() => {
    setNextTaskStarted(false);
    setDeferredTaskIds([]);
  }, []);

  const hasAssignments = assignments.length > 0;
  const isDisabled = (id: Tab) => !profile && id !== "onboarding" || (!hasAssignments && (id === "dashboard" || id === "next"));

  const handleLogout = async () => {
    await signOut(auth);
    setTab("onboarding");
    setProfile(null);
    setAssignments([]);
    setTasks([]);
    setCompletedCount(0);
    setNextTaskStarted(false);
    setDeferredTaskIds([]);
    navigate("/");
  };

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [isAuthLoading, user, navigate]);

  if (isAuthLoading) {
    return (
      <PageBackground className="flex items-center justify-center px-4">
        <div className="relative z-10 bg-card/95 rounded-2xl shadow-card border-glow p-8 text-center">
          <p className="text-muted-foreground">Checking login status...</p>
        </div>
      </PageBackground>
    );
  }

  if (!user) {
    return null;
  }

  if (isDataLoading) {
    return (
      <PageBackground className="flex items-center justify-center px-4">
        <div className="relative z-10 bg-card/95 rounded-2xl shadow-card border-glow p-8 text-center">
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground>
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center h-16">
          <span className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight text-foreground mr-8 shrink-0">
            <img src={logo} alt="TimeWise" className="h-9 w-9 rounded-xl shadow-glow" />
            <span className="text-gradient">TimeWise</span>
          </span>
          <span className="hidden md:inline text-xs text-muted-foreground mr-4 truncate max-w-[220px]">
            {user.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mr-3"
          >
            Logout
          </button>
          {isAdmin(user.email) && (
            <button
              onClick={() => navigate("/admin")}
              className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors mr-3"
            >
              Admin
            </button>
          )}
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
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : disabled
                      ? "text-muted-foreground/30 cursor-not-allowed"
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

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {tab === "onboarding" && (
          profile ? (
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="bg-card/95 rounded-2xl shadow-card border-glow p-10 card-hover">
                <p className="text-5xl mb-5 animate-float">{PLAN_CONTROL_EMOJI[profile.planControl]}</p>
                <h2 className="font-display text-2xl font-bold text-gradient mb-2">Profile Complete!</h2>
                <p className="text-muted-foreground text-sm mb-6">You're all set. Head to Assignments to get started.</p>
                <button onClick={() => setTab("assignments")} className="gradient-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold shadow-glow hover:shadow-card-hover transition-all">
                  Go to Assignments →
                </button>
              </div>
            </div>
          ) : (
            <Onboarding onComplete={handleOnboardingComplete} />
          )
        )}
        {tab === "assignments" && profile && user && (
          <Assignments
            userId={user.uid}
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
          <NextTask
            profile={profile}
            tasks={tasks}
            assignments={assignments}
            started={nextTaskStarted}
            deferredIds={deferredTaskIds}
            setStarted={setNextTaskStarted}
            setDeferredIds={setDeferredTaskIds}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onEndTasks={handleEndTasks}
          />
        )}
      </main>
    </PageBackground>
  );
}
