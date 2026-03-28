import React from "react";
import { Task, StudentProfile } from "@/types/timewise";
import { SubjectBadge } from "./SubjectBadge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Props {
  profile: StudentProfile;
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onSkip: (taskId: string) => void;
}

export function NextTask({ profile, tasks, onComplete, onSkip }: Props) {
  const incompleteTasks = tasks.filter((t) => !t.completed).sort((a, b) => b.priorityScore - a.priorityScore);
  const nextTask = incompleteTasks[0] ?? null;

  const [started, setStarted] = React.useState(false);

  if (!nextTask && !started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-foreground mb-2">All Done!</h2>
        <p className="text-muted-foreground">You've completed all your tasks. Time to relax!</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <button
          onClick={() => setStarted(true)}
          className="gradient-primary text-primary-foreground px-12 py-6 rounded-2xl text-xl font-bold shadow-lg pulse-glow transition-transform hover:scale-105"
        >
          ▶ START NEXT TASK
        </button>
        <p className="text-muted-foreground mt-4 text-sm">{incompleteTasks.length} task{incompleteTasks.length !== 1 ? "s" : ""} remaining</p>
      </div>
    );
  }

  if (!nextTask) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-5xl mb-4">🎉</p>
        <h2 className="text-2xl font-bold text-foreground mb-2">All Done!</h2>
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
          className="bg-card rounded-2xl shadow-card p-8 space-y-5"
        >
          <div className="flex items-center gap-3">
            <SubjectBadge subject={nextTask.subject} className="text-sm" />
            <span className="gradient-primary text-primary-foreground px-3 py-0.5 rounded-full text-sm font-bold ml-auto">
              Score: {nextTask.priorityScore}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground">{nextTask.name}</h2>

          <div className="space-y-2 text-sm">
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
              className="flex-1 py-3 rounded-xl font-semibold bg-success text-success-foreground transition-all hover:opacity-90 shadow-md"
            >
              ✅ Mark Complete
            </button>
            <button
              onClick={() => {
                onSkip(nextTask.id);
                toast("Task rescheduled. Priority updated.", { duration: 2000 });
              }}
              className="flex-1 py-3 rounded-xl font-semibold bg-secondary text-secondary-foreground transition-all hover:bg-muted shadow-md"
            >
              ⏭ Skip for Now
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="text-center text-sm text-muted-foreground mt-4">
        {incompleteTasks.length - 1} more task{incompleteTasks.length - 1 !== 1 ? "s" : ""} in queue
      </p>
    </div>
  );
}
