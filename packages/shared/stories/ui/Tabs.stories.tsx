import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../src/ui/tabs";

const meta = {
  title: "UI/Navigation/Tabs",
  component: TabsList,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "underline", "pills"],
    },
    children: { control: false },
  },
} satisfies Meta<typeof TabsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { variant: "default", children: null },
  render: (args) => (
    <Tabs defaultValue="overview" dir="rtl" className="max-w-lg">
      <TabsList variant={args.variant}>
        <TabsTrigger value="overview">نمای کلی</TabsTrigger>
        <TabsTrigger value="details">جزئیات</TabsTrigger>
        <TabsTrigger value="history">تاریخچه</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          غیرفعال
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">محتوای نمای کلی</TabsContent>
      <TabsContent value="details">محتوای جزئیات</TabsContent>
      <TabsContent value="history">محتوای تاریخچه</TabsContent>
    </Tabs>
  ),
};

export const AllVariants: Story = {
  args: { children: null },
  render: () => (
    <div className="space-y-8">
      {(["default", "underline", "pills"] as const).map((variant) => (
        <Tabs key={variant} defaultValue="a" dir="rtl">
          <TabsList variant={variant}>
            <TabsTrigger value="a">اول</TabsTrigger>
            <TabsTrigger value="b">دوم</TabsTrigger>
            <TabsTrigger value="c">سوم</TabsTrigger>
          </TabsList>
          <TabsContent value="a">{variant}</TabsContent>
          <TabsContent value="b">محتوای دوم</TabsContent>
          <TabsContent value="c">محتوای سوم</TabsContent>
        </Tabs>
      ))}
    </div>
  ),
};
