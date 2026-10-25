import { AdminWorkspace } from "../../features/admin-shell/AdminWorkspace";
import "../globals.css";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminWorkspace>{children}</AdminWorkspace>;
}
