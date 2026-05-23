import { StudentProfile, PLAN_CONTROL_EMOJI, PLAN_CONTROL_LABELS, PEAK_START } from "@/types/timewise";

export function ProfileCard({ profile }: { profile: StudentProfile }) {
  return (
    <div className="bg-card/95 rounded-2xl shadow-card border-glow overflow-hidden card-hover">
      <div className="gradient-primary p-5 flex items-center gap-3">
        <span className="text-4xl">{PLAN_CONTROL_EMOJI[profile.planControl]}</span>
        <div>
          <h3 className="font-display font-bold text-primary-foreground">Your Profile</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold bg-primary-foreground/20 text-primary-foreground">
            {PLAN_CONTROL_LABELS[profile.planControl]} Mode
          </span>
        </div>
      </div>
      <div className="p-5 space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Peak Time</span>
          <span className="font-medium text-foreground">{PEAK_START[profile.peakTime]}</span>
        </div>
        <div className="border-t border-border" />
        <div>
          <span className="text-muted-foreground text-xs">Top Subjects</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {profile.importantSubjects.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
