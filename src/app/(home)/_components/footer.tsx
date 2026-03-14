import Link from "next/link";
import { FileText } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-muted/30 px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground hover:text-primary transition-colors"
        >
          <FileText className="size-4" />
          Doc Forge
        </Link>
        <nav className="flex gap-6 text-sm">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/create-account"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Create account
          </Link>
        </nav>
      </div>
      <p className="text-muted-foreground mt-8 text-center text-xs">
        &copy; {year} Doc Forge. Lorem ipsum dolor sit amet.
      </p>
    </footer>
  );
}
