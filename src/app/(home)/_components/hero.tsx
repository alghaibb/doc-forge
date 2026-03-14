import Link from "next/link";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { TypingEffect } from "./typing-effect";

const TYPING_PHRASES = [
  "Lorem ipsum dolor sit amet.",
  "Consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt.",
  "Ut enim ad minim veniam.",
];

export async function Hero() {
  const session = await getSession();

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-muted/30 px-4 py-24 sm:px-6 sm:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,var(--primary)/0.06_0%,transparent_50%)]" />
      <div className="relative mx-auto max-w-3xl">
        <p className="text-primary mb-4 text-sm font-medium uppercase tracking-widest">
          Lorem ipsum
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Lorem ipsum dolor sit amet
        </h1>
        <div className="mt-3 flex items-center gap-3 text-xl text-muted-foreground sm:text-2xl md:text-3xl">
          <span className="h-8 w-px shrink-0 bg-primary/60 sm:h-10" />
          <TypingEffect
            phrases={TYPING_PHRASES}
            typingSpeed={40}
            pauseAfter={2200}
            deleteSpeed={25}
            cursor
            className="font-medium"
          />
          <span className="h-8 w-px shrink-0 bg-primary/60 sm:h-10" />
        </div>
        <p className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          {session?.user ? (
            <Button asChild size="lg">
              <Link href="/">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/create-account">Get started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
