import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "lucide-react";

import { Button } from "../../src/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../src/ui/tooltip";

const meta = {
  title: "UI/Overlays/Tooltip",
  component: TooltipContent,
  parameters: { layout: "centered" },
  args: { children: "راهنمای این دکمه", side: "top", align: "center" },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
  },
  decorators: [
    (Story) => (
      <div className="p-16">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `TooltipProvider` به‌صورت سراسری در decorator Storybook نصب است. */
export const Playground: Story = {
  render: (args) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Info size={16} />
          راهنما
        </Button>
      </TooltipTrigger>
      <TooltipContent {...args} />
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div className="sb-stack">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="ghost">{side}</Button>
          </TooltipTrigger>
          <TooltipContent {...args} side={side}>
            {side}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};
