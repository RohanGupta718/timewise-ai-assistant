import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PageBackground } from "@/components/PageBackground";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageBackground className="flex items-center justify-center px-4">
      <div className="relative z-10 text-center bg-card/95 rounded-2xl shadow-card border-glow px-10 py-12 card-hover">
        <h1 className="font-display text-5xl font-bold text-foreground mb-2">404</h1>
        <p className="text-muted-foreground mb-6">This page doesn't exist.</p>
        <Link to="/" className="inline-flex px-5 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground shadow-glow hover:shadow-card-hover transition-all">
          Return to Home
        </Link>
      </div>
    </PageBackground>
  );
};

export default NotFound;
