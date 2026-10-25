import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "../../src/ui/skeleton";

const meta = {
  title: "UI/Data Display/Skeleton",
  component: Skeleton,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "circle", "text"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { className: "h-10 w-64" },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="flex max-w-sm items-center gap-4 rounded-2xl border border-border p-4">
      <Skeleton variant="circle" className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        <Skeleton variant="text" className="w-1/2" />
      </div>
    </div>
  ),
};
