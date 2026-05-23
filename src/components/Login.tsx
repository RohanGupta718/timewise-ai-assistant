import { useState } from "react";
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

interface LoginProps {
  onLogin: (name: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    const displayName = mode === "signup" ? name.trim() : email.split("@")[0];
    onLogin(displayName);
  };

  return (
    <div className="min-h-screen gradient-mesh relative flex items-center justify-center px-4 py-10">
      <div className="page-background-glow" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <img src={logo} alt="TimeWise" className="h-12 w-12 rounded-2xl shadow-glow" />
            <span className="font-display font-bold text-3xl tracking-tight text-gradient">TimeWise</span>
          </div>
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
            <Sparkles size={14} className="text-primary" />
            Your AI study companion
          </p>
        </div>

        <div className="bg-card/95 rounded-2xl shadow-card border-glow p-7">
          <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setMode("signin"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "signin" ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === "signup" ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {mode === "signin" ? "Sign in to continue your study journey" : "Start studying smarter today"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Student"
                    className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              className="w-full gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-card-hover transition-all flex items-center justify-center gap-2 mt-2"
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground/70 mt-5">
            Demo only — no data leaves your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
