import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, LayoutTemplate } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../_components/dashboard-header";
import { TemplateCard } from "./_components/template-card";

export const metadata: Metadata = {
  title: "Templates",
};

export default async function TemplatesPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const templates = await prisma.template.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { fields: true } } },
  });

  return (
    <>
      <DashboardHeader title="Templates" />
      <div className="mx-auto w-full max-w-7xl flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {templates.length}{" "}
            {templates.length === 1 ? "template" : "templates"}
          </p>
          <Button asChild size="sm">
            <Link href="/templates/new">
              <Plus className="size-4" />
              Create template
            </Link>
          </Button>
        </div>

        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 px-6 py-16">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
              <LayoutTemplate className="size-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              No templates yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first template to get started.
            </p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/templates/new">
                <Plus className="size-4" />
                Create template
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t) => (
              <TemplateCard
                key={t.id}
                id={t.id}
                name={t.name}
                description={t.description}
                visibility={t.visibility}
                fieldCount={t._count.fields}
                updatedAt={t.updatedAt}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
