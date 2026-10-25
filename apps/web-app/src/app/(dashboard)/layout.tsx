import { AppHeader } from "../../components/AppHeader";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen min-h-0 flex-col">
      <AppHeader />
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}
