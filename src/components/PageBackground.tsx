import { cn } from "@/lib/utils";

interface PageBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function PageBackground({ children, className }: PageBackgroundProps) {
  return (
    <div className={cn("min-h-screen page-background relative", className)}>
      <div className="page-background-glow" aria-hidden="true" />
      {children}
    </div>
  );
}
