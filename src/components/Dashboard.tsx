import { Task, StudentProfile, PEAK_START, PEAK_START_HOUR } from "@/types/timewise";
import { SubjectBadge } from "./SubjectBadge";
import { ProfileCard } from "./ProfileCard";
import { AlertTriangle, Clock, CheckCircle2, ListTodo } from "lucide-react";

interface Props {
  profile: StudentProfile;
  tasks: Task[];
  completedCount: number;
}

function formatTime(hour: number, minute: number): string {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? "AM" : "PM";
  return `${h}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

export function Dashboard({ profile, tasks, completedCount }: Props) {
  const incompleteTasks = tasks.filter((t) => !t.completed).sort((a, b) => b.priorityScore - a.priorityScore);
  const totalMinutes = incompleteTasks.reduce((s, t) => s + t.durationMinutes, 0);
  const upcomingDeadlines = tasks.filter((t) => {
    if (t.completed) return false;
    const days = (new Date(t.deadline).getTime() - Date.now()) / 86400000;
    return days <= 2;
  });

  const startHour = PEAK_START_HOUR[profile.peakTime];
  let currentHour = startHour;
  let currentMinute = 0;

  const schedule = incompleteTasks.map((t) => {
    const startTime = formatTime(currentHour, currentMinute);
    currentMinute += t.durationMinutes;
    currentHour += Math.floor(currentMinute / 60);
    currentMinute = currentMinute % 60;
    const endTime = formatTime(currentHour, currentMinute);
    return { ...t, startTime, endTime };
  });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const metrics = [
    { icon: <Clock size={20} />, label: "Study Time", value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, accent: "text-primary" },
    { icon: <CheckCircle2 size={20} />, label: "Completed", value: String(completedCount), accent: "text-success" },
    { icon: <ListTodo size={20} />, label: "Remaining", value: String(incompleteTasks.length), accent: "text-accent-foreground" },
    { icon: <AlertTriangle size={20} />, label: "Due Soon", value: String(upcomingDeadlines.length), accent: "text-warning" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Today's Study Plan</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{today}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="bg-card/95 rounded-2xl shadow-card border-glow p-4 card-hover">
              <div className={`${m.accent} mb-2`}>{m.icon}</div>
              <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Schedule */}
        {schedule.length === 0 ? (
          <div className="bg-card/95 rounded-2xl shadow-card border-glow p-16 text-center card-hover">
            <p className="text-5xl mb-4">🎉</p>
            <h3 className="font-display font-bold text-foreground text-lg mb-1">All tasks completed!</h3>
            <p className="text-muted-foreground text-sm">Great work — enjoy your free time</p>
          </div>
        ) : (
          <div className="bg-card/95 rounded-2xl shadow-card border-glow overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-display font-semibold text-foreground">Schedule</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Time</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Task</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Subject</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Duration</th>
                    <th className="text-right px-5 py-3 text-muted-foreground font-medium text-xs uppercase tracking-wider">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((t, i) => (
                    <tr key={t.id} className={`border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/20 ${i === 0 ? "bg-primary/[0.03]" : ""}`}>
                      <td className="px-5 py-3.5 font-medium text-foreground whitespace-nowrap font-display">{t.startTime}</td>
                      <td className="px-5 py-3.5 text-foreground">{t.name}</td>
                      <td className="px-5 py-3.5"><SubjectBadge subject={t.subject} /></td>
                      <td className="px-5 py-3.5 text-muted-foreground">{t.durationMinutes} min</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="gradient-primary text-primary-foreground px-2.5 py-1 rounded-lg text-xs font-bold">{t.priorityScore}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:w-72 shrink-0">
        <ProfileCard profile={profile} />
      </div>
    </div>
  );
}
