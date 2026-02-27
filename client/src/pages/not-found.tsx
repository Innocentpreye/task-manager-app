import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-card border border-white/5 p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-center">
          <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>404</h1>
        <p className="text-lg text-muted-foreground">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="pt-4">
          <Button asChild className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 hover-elevate">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
