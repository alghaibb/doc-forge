import Link from "next/link";
import { FileText, Upload } from "lucide-react";

interface WelcomeBannerProps {
  name: string;
}

export function WelcomeBanner({ name }: WelcomeBannerProps) {
  const firstName = name.split(" ")[0];

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Welcome back, {firstName}
      </h2>
      <p className="mt-1 text-muted-foreground">
        Here&apos;s what&apos;s happening with your documents.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/templates/new"
          className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
            <FileText className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Create a template
            </p>
            <p className="text-xs text-muted-foreground">
              Build a reusable document with placeholders
            </p>
          </div>
        </Link>

        <Link
          href="/documents/new"
          className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-chart-2/10 text-chart-2 transition-colors group-hover:bg-chart-2/15">
            <Upload className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Upload a PDF
            </p>
            <p className="text-xs text-muted-foreground">
              Edit an existing PDF document seamlessly
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
