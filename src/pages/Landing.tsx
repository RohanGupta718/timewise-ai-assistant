import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  GraduationCap,
  ListTodo,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { PageBackground } from "@/components/PageBackground";

const SCHEDULE_PREVIEW = [
  { time: "4:00 PM", subject: "Mathematics", task: "Chapter 7 problem set", duration: "45 min", color: "border-l-subject-math" },
  { time: "4:50 PM", subject: "Sciences", task: "Lab report draft", duration: "30 min", color: "border-l-subject-physics" },
  { time: "5:25 PM", subject: "English", task: "Essay outline", duration: "25 min", color: "border-l-subject-english" },
];

const FEATURES = [
  {
    icon: ListTodo,
    title: "Assignment breakdown",
    description: "Add homework and exams — TimeWise splits them into focused study blocks sized to your attention span.",
  },
  {
    icon: CalendarDays,
    title: "Deadline-aware scheduling",
    description: "Tasks are ranked by urgency, difficulty, and your subject priorities so nothing slips through.",
  },
  {
    icon: Clock,
    title: "Built around your peak hours",
    description: "Your study plan starts when you focus best — morning, afternoon, or late-night sessions.",
  },
];

const STEPS = [
  { number: "01", title: "Set up your profile", detail: "Answer a short questionnaire about how you study." },
  { number: "02", title: "Add your assignments", detail: "Enter subjects, deadlines, and estimated effort." },
  { number: "03", title: "Follow your plan", detail: "Work through tasks one at a time with a clear daily schedule." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Landing() {
  return (
    <PageBackground className="overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-lg tracking-tight text-foreground">
            <img src={logo} alt="TimeWise" className="h-9 w-9 rounded-xl shadow-glow" />
            <span className="text-gradient">TimeWise</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <a
              href="#features"
              className="hidden sm:inline-flex px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hidden sm:inline-flex px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-secondary transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-semibold rounded-xl gradient-primary text-primary-foreground shadow-glow hover:shadow-card-hover transition-all"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" animate="visible" className="space-y-8">
            <motion.div custom={0} variants={fadeUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/60 border border-border text-xs font-medium text-muted-foreground">
              <GraduationCap size={14} className="text-primary" />
              Built for middle & high school students
            </motion.div>

            <motion.div custom={1} variants={fadeUp} className="space-y-5">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] tracking-tight text-foreground">
                Your assignments,{" "}
                <span className="text-gradient">planned around</span>{" "}
                how you actually study
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
                TimeWise turns homework and exam prep into a daily schedule — prioritized by deadline, difficulty, and your best focus hours.
              </p>
            </motion.div>

            <motion.div custom={2} variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold gradient-primary text-primary-foreground shadow-glow hover:shadow-card-hover transition-all"
              >
                Start planning free
                <ArrowRight size={18} />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold border border-border text-foreground hover:bg-secondary/80 transition-colors"
              >
                See how it works
              </a>
            </motion.div>

            <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
              {["No credit card", "Works on any device", "Your data stays yours"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 size={15} className="text-success shrink-0" />
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Schedule preview mockup */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-2xl border border-primary/15 gradient-primary-soft" />
            <div className="relative bg-card/95 rounded-2xl shadow-card border-glow overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <div>
                  <p className="font-display font-semibold text-foreground text-sm">Today's Study Plan</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sample afternoon plan</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-success/10 text-success text-xs font-medium">
                  <Sparkles size={12} />
                  3 tasks
                </div>
              </div>

              <div className="p-4 space-y-2.5">
                {SCHEDULE_PREVIEW.map((item, i) => (
                  <div
                    key={item.task}
                    className={`flex items-start gap-3 p-3.5 rounded-xl bg-secondary/40 border border-border/60 border-l-[3px] ${item.color} card-hover`}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="shrink-0 w-14 text-center">
                      <p className="text-[11px] font-medium text-muted-foreground">{item.time}</p>
                      <p className="text-[10px] text-muted-foreground/70">{item.duration}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{item.subject}</p>
                      <p className="text-sm text-muted-foreground truncate">{item.task}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 py-3.5 border-t border-border bg-secondary/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen size={14} className="text-primary" />
                  Peak session: Evening
                </div>
                <span className="text-xs font-medium text-primary">1h 40m total</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 section-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Features</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              Everything you need to stay on top of schoolwork
            </h2>
            <p className="mt-4 text-muted-foreground text-base leading-relaxed">
              Stop guessing what to work on next. TimeWise builds a plan that fits your subjects, deadlines, and study habits.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group bg-card/95 rounded-2xl shadow-card border-glow p-6 sm:p-7 card-hover"
              >
                <div className="w-11 h-11 rounded-xl gradient-primary-soft flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">How it works</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              From overwhelmed to organized in three steps
            </h2>
            <p className="mt-4 text-muted-foreground text-base leading-relaxed">
              TimeWise learns how you study, then builds a daily plan you can actually follow — one task at a time.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-semibold gradient-primary text-primary-foreground shadow-glow hover:shadow-card-hover transition-all"
            >
              Create your plan
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="flex gap-5 p-5 sm:p-6 rounded-2xl bg-card/95 shadow-card border-glow card-hover"
              >
                <span className="font-display text-2xl font-bold text-gradient shrink-0 w-10">{step.number}</span>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28">
        <div className="relative rounded-2xl overflow-hidden border border-primary/25 gradient-primary shadow-card">
          <div className="relative px-6 sm:px-12 py-14 sm:py-16 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-primary-foreground tracking-tight">
              Ready to take control of your study schedule?
            </h2>
            <p className="mt-3 text-primary-foreground/80 text-base max-w-md mx-auto">
              Join students who plan smarter and finish assignments on time.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-xl font-semibold bg-primary-foreground text-primary hover:opacity-90 transition-opacity shadow-lg"
            >
              Log in to TimeWise
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/60">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-semibold text-sm text-muted-foreground">
            <img src={logo} alt="" className="h-6 w-6 rounded-md opacity-80" />
            TimeWise — Study planner for students
          </div>
          <p className="text-xs text-muted-foreground/70">© {new Date().getFullYear()} TimeWise</p>
        </div>
      </footer>
    </PageBackground>
  );
}
