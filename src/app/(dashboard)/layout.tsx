import { AuthGuard } from "~/components/auth-guard";
import { Nav } from "~/components/nav";
import { MedicationNotifications } from "~/components/medication-notifications";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <MedicationNotifications />
        <Nav />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}

