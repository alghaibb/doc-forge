import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardHeader } from "../_components/dashboard-header";
import { WelcomeBanner } from "./_components/welcome-banner";
import { RecentDocuments } from "./_components/recent-documents";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-8 p-6">
        <WelcomeBanner name={session.user.name} />
        <div>
          <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Recent documents
          </h3>
          <RecentDocuments userId={session.user.id} />
        </div>
      </div>
    </>
  );
}
