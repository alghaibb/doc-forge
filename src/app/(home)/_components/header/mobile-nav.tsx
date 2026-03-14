"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

interface MobileNavProps {
  session: { user: { name: string } } | null;
}

export function MobileNav({ session }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          {session?.user && (
            <p className="text-muted-foreground text-sm font-normal">
              {session.user.name}
            </p>
          )}
        </SheetHeader>
        <SheetFooter className="mt-auto flex flex-col gap-2">
          {session?.user ? (
            <div className="w-full">
              <LogoutButton />
            </div>
          ) : (
            <>
              <Button asChild variant="outline" className="w-full justify-center">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="w-full justify-center">
                <Link href="/create-account">Create account</Link>
              </Button>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
