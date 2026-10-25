import type { Meta, StoryObj } from "@storybook/react-vite";

import { Spinner } from "../../src/ui/spinner";

const meta = {
  title: "UI/Feedback/Spinner",
  component: Spinner,
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="sb-stack">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
};
