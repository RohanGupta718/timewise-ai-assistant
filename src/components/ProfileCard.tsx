import { StudentProfile, MODE_EMOJI, PEAK_START } from "@/types/timewise";

export function ProfileCard({ profile }: { profile: StudentProfile }) {
  return (
    <div className="bg-card rounded-2xl shadow-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-4xl">{MODE_EMOJI[profile.mode]}</span>
        <div>
          <h3 className="font-bold text-foreground">Your Profile</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold gradient-primary text-primary-foreground">
            {profile.mode} Mode
          </span>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Peak Time</span>
          <span className="font-medium text-foreground">{PEAK_START[profile.peakTime]}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Style</span>
          <span className="font-medium text-foreground text-right">{profile.studyStyle}</span>
        </div>
        <div>
          <span className="text-muted-foreground text-xs">Top Subjects</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {profile.importantSubjects.map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
