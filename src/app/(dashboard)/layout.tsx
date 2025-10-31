import { AuthGuard } from "~/components/auth-guard";
import { Nav } from "~/components/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Nav />
        <main>{children}</main>
      </div>
    </AuthGuard>
  );
}

