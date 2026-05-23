import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { isAdmin } from "@/lib/admin";
import { PageBackground } from "@/components/PageBackground";
import { Users, ClipboardList, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

interface UserRow {
  id: string;
  email?: string;
  name?: string;
  assignments: number;
  tasks: number;
  completed: number;
  updatedAt?: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (checking) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!isAdmin(user.email)) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, "users"));
        const data: UserRow[] = snap.docs.map((d) => {
          const v = d.data() as any;
          return {
            id: d.id,
            email: v?.profile?.email ?? undefined,
            name: v?.profile?.name ?? undefined,
            assignments: Array.isArray(v?.assignments) ? v.assignments.length : 0,
            tasks: Array.isArray(v?.tasks) ? v.tasks.length : 0,
            completed: typeof v?.completedCount === "number" ? v.completedCount : 0,
            updatedAt: v?.updatedAt,
          };
        });
        setRows(data);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [checking, user, navigate]);

  if (checking) {
    return (
      <PageBackground className="flex items-center justify-center px-4">
        <div className="relative z-10 bg-card/95 rounded-2xl shadow-card border-glow p-8 text-center">
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </PageBackground>
    );
  }

  if (!user || !isAdmin(user.email)) {
    return (
      <PageBackground className="flex items-center justify-center px-4">
        <div className="relative z-10 bg-card/95 rounded-2xl shadow-card border-glow p-8 text-center max-w-md">
          <ShieldCheck size={40} className="mx-auto text-destructive mb-3" />
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-sm text-muted-foreground mb-5">
            You don't have permission to view this page.
          </p>
          <button
            onClick={() => navigate("/app")}
            className="gradient-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold shadow-glow"
          >
            Back to App
          </button>
        </div>
      </PageBackground>
    );
  }

  const totalUsers = rows.length;
  const totalAssignments = rows.reduce((a, r) => a + r.assignments, 0);
  const totalCompleted = rows.reduce((a, r) => a + r.completed, 0);

  return (
    <PageBackground>
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
          <span className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight">
            <img src={logo} alt="TimeWise" className="h-9 w-9 rounded-xl shadow-glow" />
            <span className="text-gradient">TimeWise Admin</span>
          </span>
          <span className="ml-auto text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
          <button
            onClick={() => navigate("/app")}
            className="px-3 py-1.5 text-xs rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft size={14} /> App
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-gradient mb-1">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of all TimeWise users.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<Users size={20} />} label="Total Users" value={totalUsers} />
          <StatCard icon={<ClipboardList size={20} />} label="Total Assignments" value={totalAssignments} />
          <StatCard icon={<CheckCircle2 size={20} />} label="Tasks Completed" value={totalCompleted} />
        </div>

        <div className="bg-card/95 rounded-2xl shadow-card border-glow overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display text-lg font-semibold text-foreground">Users</h2>
          </div>
          {loading ? (
            <p className="p-6 text-sm text-muted-foreground">Loading users...</p>
          ) : error ? (
            <p className="p-6 text-sm text-destructive">{error}</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No users yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">User ID</th>
                    <th className="text-left px-6 py-3 font-medium">Name</th>
                    <th className="text-right px-6 py-3 font-medium">Assignments</th>
                    <th className="text-right px-6 py-3 font-medium">Tasks</th>
                    <th className="text-right px-6 py-3 font-medium">Completed</th>
                    <th className="text-left px-6 py-3 font-medium">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-muted-foreground truncate max-w-[180px]">{r.id}</td>
                      <td className="px-6 py-3 text-foreground">{r.name ?? "—"}</td>
                      <td className="px-6 py-3 text-right text-foreground">{r.assignments}</td>
                      <td className="px-6 py-3 text-right text-foreground">{r.tasks}</td>
                      <td className="px-6 py-3 text-right text-foreground">{r.completed}</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">
                        {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </PageBackground>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card/95 rounded-2xl shadow-card border-glow p-5 card-hover">
      <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide mb-2">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-display text-3xl font-bold text-gradient">{value}</p>
    </div>
  );
}
