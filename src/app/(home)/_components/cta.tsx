import Link from "next/link";
import { getSession } from "@/lib/session";
import { ArrowRight } from "lucide-react";

export async function Cta() {
  const session = await getSession();

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="glow-border relative overflow-hidden rounded-3xl bg-linear-to-br from-primary/5 via-background to-primary/5 p-px">
          <div className="rounded-[calc(1.5rem-1px)] bg-background p-10 text-center sm:p-16">
            <p className="text-primary mb-3 text-sm font-medium uppercase tracking-widest">
              Lorem ipsum
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Lorem ipsum dolor sit amet
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-lg leading-relaxed">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {session ? (
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                >
                  Go to dashboard
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/create-account"
                    className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
                  >
                    Lorem ipsum
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center rounded-xl border border-border/60 bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted"
                  >
                    Dolor sit amet
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
