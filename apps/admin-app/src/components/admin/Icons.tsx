import {
  BadgeCheck,
  BarChart3,
  Bot,
  Database,
  FileText,
  FolderKanban,
  Layers,
  LayoutDashboard,
  ListTree,
  Lock,
  ScrollText,
  Server,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
  Building2,
  KeyRound,
} from "lucide-react";

const icons = {
  overview: LayoutDashboard,
  dashboard: LayoutDashboard,
  users: Users,
  roles: ShieldCheck,
  permissions: Lock,
  tenants: Building2,
  clients: KeyRound,
  scopes: Layers,
  authorizations: BadgeCheck,
  tokens: Ticket,
  "audit-logs": ScrollText,
  system: Server,
  settings: Settings,
  menus: ListTree,
  content: FolderKanban,
  reports: BarChart3,
  documents: FileText,
  models: Bot,
  datasets: Database,
  evaluations: BarChart3,
} as const;

export type NavigationIconName = keyof typeof icons;

function resolveIcon(...names: Array<string | null | undefined>) {
  for (const name of names) {
    if (!name) continue;
    const key = name.trim().toLowerCase();
    if (key in icons) return icons[key as NavigationIconName];
  }
  return LayoutDashboard;
}

export function NavigationIcon({
  name,
  fallback,
  size = 18,
}: {
  name?: string | null;
  fallback?: string | null;
  size?: number;
}) {
  const Component = resolveIcon(name, fallback);
  return <Component size={size} strokeWidth={1.8} />;
}
