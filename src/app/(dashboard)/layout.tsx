import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SidebarProvider } from "./_components/sidebar-context";
import { Sidebar } from "./_components/sidebar";
import { DashboardShell } from "./_components/dashboard-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const user = {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };

  return (
    <SidebarProvider>
      <Sidebar user={user} />
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  );
}
