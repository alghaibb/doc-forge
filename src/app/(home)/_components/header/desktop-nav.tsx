import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

interface DesktopNavProps {
  session: { user: { name: string } } | null;
}

export function DesktopNav({ session }: DesktopNavProps) {
  return (
    <nav className="hidden items-center gap-4 md:flex">
      {session?.user ? (
        <>
          <span className="text-muted-foreground text-sm">
            {session.user.name}
          </span>
          <LogoutButton />
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/create-account"
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors"
          >
            Create account
          </Link>
        </>
      )}
    </nav>
  );
}
