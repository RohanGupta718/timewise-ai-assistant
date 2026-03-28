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

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Today's Study Plan</h2>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Clock size={18} />, label: "Study Time", value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`, color: "text-primary" },
            { icon: <CheckCircle2 size={18} />, label: "Completed", value: String(completedCount), color: "text-success" },
            { icon: <ListTodo size={18} />, label: "Remaining", value: String(incompleteTasks.length), color: "text-accent" },
            { icon: <AlertTriangle size={18} />, label: "Due Soon", value: String(upcomingDeadlines.length), color: "text-warning" },
          ].map((m) => (
            <div key={m.label} className="bg-card rounded-2xl shadow-card p-4">
              <div className={`${m.color} mb-1`}>{m.icon}</div>
              <p className="text-2xl font-bold text-foreground">{m.value}</p>
              <p className="text-xs text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Schedule */}
        {schedule.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-card p-12 text-center">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-muted-foreground font-medium">All tasks completed! Great work!</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Time</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Task</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Subject</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Duration</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((t, i) => (
                    <tr key={t.id} className={`border-b border-border last:border-0 ${i === 0 ? "bg-secondary/50" : ""}`}>
                      <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{t.startTime}</td>
                      <td className="px-4 py-3 text-foreground">{t.name}</td>
                      <td className="px-4 py-3"><SubjectBadge subject={t.subject} /></td>
                      <td className="px-4 py-3 text-muted-foreground">{t.durationMinutes} min</td>
                      <td className="px-4 py-3 text-right">
                        <span className="gradient-primary text-primary-foreground px-2.5 py-0.5 rounded-full text-xs font-bold">{t.priorityScore}</span>
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
