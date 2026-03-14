import { FileText } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-primary relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)]" />
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-white/5" />
        <div className="absolute bottom-1/4 right-1/4 size-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="bg-primary-foreground/20 flex size-9 items-center justify-center rounded-lg">
            <FileText className="text-primary-foreground size-5" />
          </div>
          <span className="text-primary-foreground text-xl font-semibold tracking-tight">
            Doc Forge
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-4">
            <p className="text-primary-foreground/90 text-lg leading-relaxed font-medium">
              &ldquo;Doc Forge transformed the way our team handles PDF
              documents. What used to take hours now takes minutes.&rdquo;
            </p>
            <footer className="text-primary-foreground/70 text-sm">
              &mdash; Sarah Chen, Product Manager
            </footer>
          </blockquote>
        </div>

        <p className="text-primary-foreground/50 relative z-10 text-xs">
          &copy; {new Date().getFullYear()} Doc Forge. All rights reserved.
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
