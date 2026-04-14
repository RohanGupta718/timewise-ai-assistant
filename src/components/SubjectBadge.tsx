import { Subject, SUBJECT_KEY } from "@/types/timewise";

const SUBJECT_STYLES: Record<string, string> = {
  math: "bg-subject-math/15 text-subject-math",
  sciences: "bg-subject-physics/15 text-subject-physics",
  english: "bg-subject-english/15 text-subject-english",
  humanities: "bg-subject-history/15 text-subject-history",
  cs: "bg-subject-cs/15 text-subject-cs",
  arts: "bg-subject-other/15 text-subject-other",
};

export function SubjectBadge({ subject, className = "" }: { subject: Subject; className?: string }) {
  const key = SUBJECT_KEY[subject];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${SUBJECT_STYLES[key] ?? ""} ${className}`}>
      {subject}
    </span>
  );
}
