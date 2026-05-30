import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import logo from "@/assets/logo.png";
import { PageBackground } from "@/components/PageBackground";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/app", { replace: true });
      } else {
        setIsAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleAuthSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    setIsSubmittingAuth(true);
    const normalizedEmail = email.trim();

    try {
      if (isSignUpMode) {
        if (password !== confirmPassword) {
          setAuthError("Passwords do not match");
          setIsSubmittingAuth(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      } else {
        const methods = await fetchSignInMethodsForEmail(auth, normalizedEmail);
        if (methods.length === 0) {
          setAuthError("User doesn't exist. Please sign up first.");
          setIsSignUpMode(true);
          setIsSubmittingAuth(false);
          return;
        }
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      }
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const code = (error as { code?: string })?.code ?? "";
      let message = "Something went wrong. Please try again.";
      switch (code) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
        case "auth/invalid-login-credentials":
          message = "Wrong password";
          break;
        case "auth/user-not-found":
          message = "No account found with this email";
          break;
        case "auth/invalid-email":
          message = "Invalid email address";
          break;
        case "auth/email-already-in-use":
          message = "An account with this email already exists";
          break;
        case "auth/weak-password":
          message = "Password is too weak (min 6 characters)";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Please try again later";
          break;
        case "auth/network-request-failed":
          message = "Network error. Check your connection";
          break;
      }
      setAuthError(message);
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  if (isAuthLoading) {
    return (
      <PageBackground className="flex items-center justify-center px-4">
        <div className="relative z-10 bg-card/95 rounded-2xl shadow-card border-glow p-8 text-center">
          <p className="text-muted-foreground text-sm">Checking login status...</p>
        </div>
      </PageBackground>
    );
  }

  return (
    <PageBackground className="flex items-center justify-center px-4 py-10">
      <div className="relative z-10 w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-4">
            <img src={logo} alt="TimeWise" className="h-12 w-12 rounded-2xl shadow-glow" />
            <span className="font-display font-bold text-3xl tracking-tight text-gradient">TimeWise</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Sign in to access your study planner
          </p>
        </div>

        <div className="bg-card/95 rounded-2xl shadow-card border-glow p-7 sm:p-8">
          <div className="flex gap-1 p-1 bg-secondary/50 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setIsSignUpMode(false); setAuthError(""); setConfirmPassword(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                !isSignUpMode ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUpMode(true); setAuthError(""); }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                isSignUpMode ? "gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign up
            </button>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            {isSignUpMode ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            {isSignUpMode
              ? "Start building your personalized study plan"
              : "Continue where you left off"}
          </p>

          <form className="space-y-4" onSubmit={handleAuthSubmit}>
            <div>
              <label htmlFor="email" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@school.edu"
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete={isSignUpMode ? "new-password" : "current-password"}
                  minLength={6}
                  required
                  className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {isSignUpMode && (
              <div>
                <label htmlFor="confirmPassword" className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            {authError && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmittingAuth}
              className="w-full gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-card-hover transition-all flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {isSubmittingAuth
                ? "Please wait..."
                : isSignUpMode
                ? "Create account"
                : "Log in"}
              {!isSubmittingAuth && <ArrowRight size={16} />}
            </button>
          </form>
        </div>
      </div>
    </PageBackground>
  );
}
