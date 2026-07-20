import type { Metadata } from "next";
import { verifyAdminSession } from "@/app/lib/dal";
import Sidebar from "./Sidebar";

export const metadata: Metadata = {
  title: "Admin Panel | Sun Ray",
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifyAdminSession();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar adminName={session.name} />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
