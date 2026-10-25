import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Menu, PanelRightClose } from "lucide-react";

import { Button } from "../../src/ui/button";
import { Card } from "../../src/ui/card";
import { WorkspaceShell } from "../../src/ui/workspace-shell";

const meta = {
  title: "UI/Layout/WorkspaceShell",
  component: WorkspaceShell,
  parameters: { layout: "fullscreen" },
  args: {
    sidebar: null,
    header: null,
    children: null,
    sidebarWidth: 288,
    collapsedSidebarWidth: 82,
  },
  argTypes: {
    sidebar: { control: false },
    header: { control: false },
    children: { control: false },
  },
} satisfies Meta<typeof WorkspaceShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const navItems = ["داشبورد", "کاربران", "نقش‌ها", "اسناد", "تنظیمات"];

function ShellDemo(props: React.ComponentProps<typeof WorkspaceShell>) {
  const [collapsed, setCollapsed] = useState(props.collapsed ?? false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-[600px]">
      <WorkspaceShell
        {...props}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        sidebar={
          <nav
            className="h-full border-l border-border bg-surface p-4"
            style={{
              width: collapsed
                ? props.collapsedSidebarWidth
                : props.sidebarWidth,
            }}
          >
            <ul className="space-y-1 text-sm">
              {navItems.map((item) => (
                <li
                  key={item}
                  className="truncate rounded-lg px-3 py-2 hover:bg-primary/10"
                >
                  {collapsed ? item.slice(0, 1) : item}
                </li>
              ))}
            </ul>
          </nav>
        }
        header={
          <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
            <Button
              size="sm"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={16} />
            </Button>
            <span className="font-semibold">پنل مدیریت</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setCollapsed((value) => !value)}
            >
              <PanelRightClose size={16} />
            </Button>
          </header>
        }
      >
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Card title="کاربران فعال" subtitle="۲۴ ساعت اخیر">
            <span className="text-3xl font-bold">۱٬۲۴۸</span>
          </Card>
          <Card title="درخواست‌ها" subtitle="امروز">
            <span className="text-3xl font-bold">۸٬۹۰۲</span>
          </Card>
        </div>
      </WorkspaceShell>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <ShellDemo {...args} />,
};

export const Collapsed: Story = {
  args: { collapsed: true },
  render: (args) => <ShellDemo {...args} />,
};
