import type { Meta, StoryObj } from "@storybook/react-vite";
import { Download, Plus, Trash2 } from "lucide-react";
import { fn } from "storybook/test";

import { Button } from "../../src/ui/button";

const meta = {
  title: "UI/Actions/Button",
  component: Button,
  args: {
    children: "ذخیره تغییرات",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "danger"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="sb-stack">
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-stack">
      <Button {...args} size="sm">
        کوچک
      </Button>
      <Button {...args} size="md">
        متوسط
      </Button>
      <Button {...args} size="lg">
        بزرگ
      </Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="sb-stack">
      <Button {...args}>
        <Plus size={16} />
        افزودن
      </Button>
      <Button {...args} variant="outline">
        <Download size={16} />
        دریافت گزارش
      </Button>
      <Button {...args} variant="danger">
        <Trash2 size={16} />
        حذف
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { loading: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
