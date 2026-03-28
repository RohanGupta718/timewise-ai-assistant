import { useState } from "react";
import { SUBJECTS, Subject, Difficulty, ESTIMATED_TIMES, Assignment, Task, StudentProfile } from "@/types/timewise";
import { SubjectBadge } from "./SubjectBadge";
import { Trash2 } from "lucide-react";

interface Props {
  profile: StudentProfile;
  assignments: Assignment[];
  tasks: Task[];
  onAddAssignment: (a: Assignment, tasks: Task[]) => void;
  onDeleteAssignment: (id: string) => void;
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function computePriority(
  deadline: string,
  difficulty: Difficulty,
  subject: Subject,
  delayPenalty: number,
  importantSubjects: Subject[]
): number {
  const days = Math.max(0.1, (new Date(deadline).getTime() - Date.now()) / 86400000);
  const urgency = Math.min(10, Math.max(0.5, 10 / days));
  const diffScore = difficulty === "Low" ? 1 : difficulty === "Medium" ? 3 : 5;
  const importance = importantSubjects.includes(subject) ? 4 : 2;
  return Math.round((urgency + diffScore + importance + delayPenalty) * 10) / 10;
}

function breakdownTasks(
  assignment: Assignment,
  profile: StudentProfile
): Task[] {
  const base = {
    assignmentId: assignment.id,
    subject: assignment.subject,
    deadline: assignment.deadline,
    difficulty: assignment.difficulty,
    delayPenalty: 0,
    completed: false,
  };

  const priority = (dur: number) =>
    computePriority(assignment.deadline, assignment.difficulty, assignment.subject, 0, profile.importantSubjects);

  if (assignment.estimatedMinutes <= 30) {
    const dur = assignment.estimatedMinutes;
    return [{ ...base, id: generateId(), name: `Complete ${assignment.name}`, durationMinutes: dur, priorityScore: priority(dur) }];
  }
  if (assignment.estimatedMinutes <= 60) {
    const d = Math.round(assignment.estimatedMinutes / 2);
    return [
      { ...base, id: generateId(), name: `Study ${assignment.name} – Part 1`, durationMinutes: d, priorityScore: priority(d) },
      { ...base, id: generateId(), name: `Review & practice`, durationMinutes: assignment.estimatedMinutes - d, priorityScore: priority(d) },
    ];
  }
  const d1 = Math.round(assignment.estimatedMinutes * 0.35);
  const d2 = Math.round(assignment.estimatedMinutes * 0.4);
  const d3 = assignment.estimatedMinutes - d1 - d2;
  return [
    { ...base, id: generateId(), name: `Read & understand – ${assignment.name}`, durationMinutes: d1, priorityScore: priority(d1) },
    { ...base, id: generateId(), name: `Solve / Write – ${assignment.name}`, durationMinutes: d2, priorityScore: priority(d2) },
    { ...base, id: generateId(), name: `Review & revise – ${assignment.name}`, durationMinutes: d3, priorityScore: priority(d3) },
  ];
}

export { computePriority, breakdownTasks };

export function Assignments({ profile, assignments, tasks, onAddAssignment, onDeleteAssignment }: Props) {
  const [subject, setSubject] = useState<Subject>("Math");
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [estTime, setEstTime] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deadline) return;
    const assignment: Assignment = {
      id: generateId(),
      subject,
      name: name.trim(),
      deadline,
      difficulty,
      estimatedMinutes: estTime,
    };
    const newTasks = breakdownTasks(assignment, profile);
    onAddAssignment(assignment, newTasks);
    setName("");
    setDeadline("");
    setDifficulty("Medium");
    setEstTime(30);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Add Assignment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Assignment Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Chapter 5 Exercises"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Deadline</label>
              <input
                type="date"
                value={deadline}
                min={today}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">Estimated Time</label>
              <select
                value={estTime}
                onChange={(e) => setEstTime(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {ESTIMATED_TIMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {(["Low", "Medium", "High"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    difficulty === d
                      ? d === "Low" ? "bg-success text-success-foreground" : d === "Medium" ? "bg-warning text-warning-foreground" : "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !deadline}
            className="w-full py-3 rounded-xl font-semibold gradient-primary text-primary-foreground disabled:opacity-40 transition-all shadow-md hover:shadow-lg"
          >
            Add Assignment +
          </button>
        </form>
      </div>

      {assignments.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-card p-12 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-muted-foreground font-medium">No tasks yet! Add your first assignment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => {
            const aTasks = tasks.filter((t) => t.assignmentId === a.id);
            const maxPriority = Math.max(...aTasks.map((t) => t.priorityScore));
            return (
              <div key={a.id} className="bg-card rounded-2xl shadow-card p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <SubjectBadge subject={a.subject} />
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      a.difficulty === "Low" ? "bg-success/15 text-success" : a.difficulty === "Medium" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
                    }`}>{a.difficulty}</span>
                  </div>
                  <h3 className="font-semibold text-foreground truncate">{a.name}</h3>
                  <p className="text-xs text-muted-foreground">Due: {new Date(a.deadline).toLocaleDateString()} · {aTasks.length} task{aTasks.length !== 1 ? "s" : ""}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div className="gradient-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                    {maxPriority}
                  </div>
                  <button onClick={() => onDeleteAssignment(a.id)} className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
