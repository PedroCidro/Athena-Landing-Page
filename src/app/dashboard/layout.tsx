import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { AuthProvider } from "@/components/dashboard/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | Athena Studios",
    template: "%s | Athena Studios",
  },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="dashboard-app flex h-screen overflow-hidden">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </AuthProvider>
  );
}
