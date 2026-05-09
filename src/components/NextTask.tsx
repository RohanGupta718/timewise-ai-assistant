import React from "react";
import { Task, StudentProfile } from "@/types/timewise";
import { SubjectBadge } from "./SubjectBadge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Play, CheckCircle, SkipForward, Square } from "lucide-react";

interface Props {
  profile: StudentProfile;
  tasks: Task[];
  started: boolean;
  deferredIds: string[];
  setStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setDeferredIds: React.Dispatch<React.SetStateAction<string[]>>;
  onComplete: (taskId: string) => void;
  onSkip: (taskId: string) => void;
  onEndTasks: () => void;
}

function sortByPriorityRating(a: Task, b: Task): number {
  if (b.priorityScore !== a.priorityScore) return b.priorityScore - a.priorityScore;
  const da = new Date(a.deadline).getTime();
  const db = new Date(b.deadline).getTime();
  if (da !== db) return da - db;
  return a.name.localeCompare(b.name);
}

export function NextTask({
  profile,
  tasks,
  started,
  deferredIds,
  setStarted,
  setDeferredIds,
  onComplete,
  onSkip,
  onEndTasks,
}: Props) {
  const incompleteTasks = React.useMemo(
    () => tasks.filter((t) => !t.completed).sort(sortByPriorityRating),
    [tasks]
  );

  React.useEffect(() => {
    setDeferredIds((prev) => prev.filter((id) => incompleteTasks.some((t) => t.id === id)));
  }, [incompleteTasks]);

  const deferredSet = React.useMemo(() => new Set(deferredIds), [deferredIds]);
  const nextUp = incompleteTasks.filter((t) => !deferredSet.has(t.id));
  const deferredOrdered = incompleteTasks.filter((t) => deferredSet.has(t.id));
  const orderedQueue =
    nextUp.length > 0 ? [...nextUp, ...deferredOrdered] : incompleteTasks;
  const nextTask = orderedQueue[0] ?? null;

  if (!nextTask && !started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-6xl mb-5">🎉</p>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">All Done!</h2>
        <p className="text-muted-foreground">You've completed all your tasks. Time to relax!</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <button
          onClick={() => setStarted(true)}
          className="gradient-primary text-primary-foreground px-14 py-7 rounded-2xl text-xl font-display font-bold shadow-lg pulse-glow transition-transform hover:scale-105 flex items-center gap-3"
        >
          <Play size={24} />
          START NEXT TASK
        </button>
        <p className="text-muted-foreground mt-5 text-sm">{incompleteTasks.length} task{incompleteTasks.length !== 1 ? "s" : ""} remaining</p>
      </div>
    );
  }

  if (!nextTask) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-6xl mb-5">🎉</p>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">All Done!</h2>
        <p className="text-muted-foreground">You've completed all your tasks!</p>
      </div>
    );
  }

  const daysUntil = Math.max(0, Math.round((new Date(nextTask.deadline).getTime() - Date.now()) / 86400000));
  const reason = daysUntil <= 2
    ? `⚠️ High urgency — due in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`
    : profile.importantSubjects.includes(nextTask.subject)
    ? "⭐ Important subject for your goals"
    : `📅 Due in ${daysUntil} days`;

  return (
    <div className="max-w-lg mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={nextTask.id}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl shadow-card p-8 sm:p-10 space-y-6"
        >
          <div className="flex items-center gap-3">
            <SubjectBadge subject={nextTask.subject} className="text-sm" />
            <span className="gradient-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-bold ml-auto shadow-sm">
              Priority: {nextTask.priorityScore}
            </span>
          </div>

          <h2 className="font-display text-2xl font-bold text-foreground">{nextTask.name}</h2>

          <div className="space-y-2.5 text-sm bg-secondary/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>⏱</span>
              <span>{nextTask.durationMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>📅</span>
              <span>Due: {new Date(nextTask.deadline).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>💡</span>
              <span>{reason}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onComplete(nextTask.id)}
              className="flex-1 py-3.5 rounded-xl font-semibold bg-success text-success-foreground transition-all hover:opacity-90 shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Mark Complete
            </button>
            <button
              onClick={() => {
                onSkip(nextTask.id);
                setDeferredIds((prev) => {
                  const withSkip = [...prev, nextTask.id];
                  const def = new Set(withSkip);
                  const stillUp = incompleteTasks.filter((t) => !def.has(t.id));
                  if (stillUp.length === 0) return [];
                  return withSkip;
                });
                toast("Skipped — showing the next task.", { duration: 2000 });
              }}
              className="flex-1 py-3.5 rounded-xl font-semibold bg-secondary text-secondary-foreground transition-all hover:bg-muted shadow-md flex items-center justify-center gap-2"
            >
              <SkipForward size={18} />
              Skip for Now
            </button>
          </div>

          <button
            onClick={onEndTasks}
            className="w-full py-3 rounded-xl font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center justify-center gap-2"
          >
            <Square size={16} />
            End Tasks
          </button>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-sm text-muted-foreground mt-5">
        {incompleteTasks.length - 1} more task{incompleteTasks.length - 1 !== 1 ? "s" : ""} in queue
      </p>
    </div>
  );
}
