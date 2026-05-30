import { useRef, useState } from "react";
import { SUBJECTS, Subject, Difficulty, ESTIMATED_TIMES, Assignment, Task, StudentProfile } from "@/types/timewise";
import { uploadAssignmentDocument, validateAssignmentDocument } from "@/lib/assignmentDocuments";
import { SubjectBadge } from "./SubjectBadge";
import { FileText, Paperclip, Trash2, Plus, X } from "lucide-react";

interface Props {
  userId: string;
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
  const base = urgency + diffScore + importance;
  return Math.round(Math.max(0.1, base - delayPenalty) * 10) / 10;
}

function breakdownTasks(assignment: Assignment, profile: StudentProfile): Task[] {
  const base = {
    assignmentId: assignment.id,
    subject: assignment.subject,
    deadline: assignment.deadline,
    difficulty: assignment.difficulty,
    delayPenalty: 0,
    completed: false,
  };

  const priority = () =>
    computePriority(assignment.deadline, assignment.difficulty, assignment.subject, 0, profile.importantSubjects);

  if (assignment.estimatedMinutes <= 30) {
    const dur = assignment.estimatedMinutes;
    return [{ ...base, id: generateId(), name: `Complete ${assignment.name}`, durationMinutes: dur, priorityScore: priority() }];
  }
  if (assignment.estimatedMinutes <= 60) {
    const d = Math.round(assignment.estimatedMinutes / 2);
    return [
      { ...base, id: generateId(), name: `Study ${assignment.name} – Part 1`, durationMinutes: d, priorityScore: priority() },
      { ...base, id: generateId(), name: `Review & practice`, durationMinutes: assignment.estimatedMinutes - d, priorityScore: priority() },
    ];
  }
  const d1 = Math.round(assignment.estimatedMinutes * 0.35);
  const d2 = Math.round(assignment.estimatedMinutes * 0.4);
  const d3 = assignment.estimatedMinutes - d1 - d2;
  return [
    { ...base, id: generateId(), name: `Read & understand – ${assignment.name}`, durationMinutes: d1, priorityScore: priority() },
    { ...base, id: generateId(), name: `Solve / Write – ${assignment.name}`, durationMinutes: d2, priorityScore: priority() },
    { ...base, id: generateId(), name: `Review & revise – ${assignment.name}`, durationMinutes: d3, priorityScore: priority() },
  ];
}

export { computePriority, breakdownTasks };

export function Assignments({ userId, profile, assignments, tasks, onAddAssignment, onDeleteAssignment }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState<Subject>("Mathematics");
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [estTime, setEstTime] = useState(30);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !deadline || isSubmitting) return;

    setFormError("");
    if (documentFile) {
      const validationError = validateAssignmentDocument(documentFile);
      if (validationError) {
        setFormError(validationError);
        return;
      }
    }

    setIsSubmitting(true);
    const assignmentId = generateId();

    try {
      let documentFields: Partial<Assignment> = {};
      if (documentFile) {
        documentFields = await uploadAssignmentDocument(userId, assignmentId, documentFile);
      }

      const assignment: Assignment = {
        id: assignmentId,
        subject,
        name: name.trim(),
        deadline,
        difficulty,
        estimatedMinutes: estTime,
        ...documentFields,
      };
      const newTasks = breakdownTasks(assignment, profile);
      onAddAssignment(assignment, newTasks);
      setName("");
      setDeadline("");
      setDifficulty("Medium");
      setEstTime(30);
      setDocumentFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to add assignment:", error);
      setFormError("Failed to upload assignment document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const completedTasks = tasks
    .filter((t) => t.completed)
    .sort((a, b) => new Date(b.deadline).getTime() - new Date(a.deadline).getTime());
  const completedByAssignment = assignments
    .map((assignment) => ({
      assignment,
      tasks: completedTasks.filter((task) => task.assignmentId === assignment.id),
    }))
    .filter((group) => group.tasks.length > 0);

  return (
    <div className="space-y-8">
      {/* Form */}
      <div className="bg-card/95 rounded-2xl shadow-card border-glow p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-sm">
            <Plus size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">Add Assignment</h2>
            <p className="text-sm text-muted-foreground">We'll auto-generate study tasks for you</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              >
                {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Assignment Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Chapter 5 Exercises"
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Deadline</label>
              <input
                type="date"
                value={deadline}
                min={today}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Estimated Time</label>
              <select
                value={estTime}
                onChange={(e) => setEstTime(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              >
                {ESTIMATED_TIMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {(["Low", "Medium", "High"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                    difficulty === d
                      ? d === "Low" ? "bg-success/10 text-success border-success/30" : d === "Medium" ? "bg-warning/10 text-warning border-warning/30" : "bg-destructive/10 text-destructive border-destructive/30"
                      : "bg-secondary text-secondary-foreground border-border hover:bg-muted"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Assignment Document <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => {
                setFormError("");
                setDocumentFile(e.target.files?.[0] ?? null);
              }}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
            {documentFile ? (
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Paperclip size={14} />
                <span className="truncate">{documentFile.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setDocumentFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="ml-auto p-1 rounded-md hover:bg-secondary hover:text-foreground transition-colors"
                  aria-label="Remove file"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <p className="mt-1.5 text-xs text-muted-foreground">PDF or image, up to 10 MB</p>
            )}
          </div>

          {formError && (
            <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={!name.trim() || !deadline || isSubmitting}
            className="w-full py-3 rounded-xl font-semibold gradient-primary text-primary-foreground disabled:opacity-40 transition-all shadow-md hover:shadow-lg"
          >
            {isSubmitting ? "Uploading..." : "Add Assignment"}
          </button>
        </form>
      </div>

      {/* List */}
      {assignments.length === 0 ? (
        <div className="bg-card/95 rounded-2xl shadow-card border-glow p-16 text-center card-hover">
          <p className="text-5xl mb-4">📚</p>
          <h3 className="font-display font-bold text-foreground text-lg mb-1">No assignments yet</h3>
          <p className="text-muted-foreground text-sm">Add your first assignment above to get started</p>
        </div>
      ) : (
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">{assignments.length} Assignment{assignments.length !== 1 ? "s" : ""}</h3>
          <div className="space-y-3">
            {assignments.map((a) => {
              const aTasks = tasks.filter((t) => t.assignmentId === a.id);
              const maxPriority = Math.max(...aTasks.map((t) => t.priorityScore));
              return (
                <div key={a.id} className="bg-card/95 rounded-2xl shadow-card border-glow p-5 flex items-center gap-4 card-hover">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <SubjectBadge subject={a.subject} />
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                        a.difficulty === "Low" ? "bg-success/10 text-success" : a.difficulty === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                      }`}>{a.difficulty}</span>
                    </div>
                    <h3 className="font-display font-semibold text-foreground truncate">{a.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Due: {new Date(a.deadline).toLocaleDateString()} · {aTasks.length} task{aTasks.length !== 1 ? "s" : ""}
                      {a.documentUrl && (
                        <>
                          {" · "}
                          <a
                            href={a.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText size={12} />
                            Document
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="gradient-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                      {maxPriority}
                    </div>
                    <button onClick={() => onDeleteAssignment(a.id)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-card/95 rounded-2xl shadow-card border-glow p-5 sm:p-6">
        <details>
          <summary className="list-none cursor-pointer flex items-center justify-between gap-3">
            <span className="font-display font-semibold text-foreground">
              Completed Tasks ({completedTasks.length})
            </span>
            <span className="text-xs text-muted-foreground">Click to expand</span>
          </summary>

          <div className="mt-4 border-t border-border pt-4">
            {completedTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No completed tasks yet.</p>
            ) : (
              <div className="space-y-4">
                {completedByAssignment.map(({ assignment, tasks: assignmentTasks }) => (
                  <div key={assignment.id} className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{assignment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(assignment.deadline).toLocaleDateString()} · {assignmentTasks.length} completed
                        </p>
                      </div>
                      <SubjectBadge subject={assignment.subject} className="text-xs shrink-0" />
                    </div>

                    {assignmentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{task.name}</p>
                          <p className="text-xs text-muted-foreground">{task.durationMinutes} min</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">Completed</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}
