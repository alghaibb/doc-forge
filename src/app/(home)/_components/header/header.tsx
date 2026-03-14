import { getSession } from "@/lib/session";
import { FileText } from "lucide-react";
import Link from "next/link";
import { DesktopNav } from "@/app/(home)/_components/header/desktop-nav";
import { MobileNav } from "@/app/(home)/_components/header/mobile-nav";

export async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-border/60 bg-background/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          <FileText className="size-5" />
          Doc Forge
        </Link>
        <DesktopNav session={session} />
        <MobileNav session={session} />
      </div>
    </header>
  );
}
