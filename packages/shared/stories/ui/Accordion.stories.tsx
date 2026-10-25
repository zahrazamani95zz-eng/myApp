import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../src/ui/accordion";

type SingleStoryArgs = {
  collapsible: boolean;
  defaultValue: string;
};

type MultipleStoryArgs = {
  defaultValue: string[];
};

const meta = {
  title: "UI/Data Display/Accordion",
  component: Accordion,
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;

type SingleStory = StoryObj<Meta<SingleStoryArgs>>;
type MultipleStory = StoryObj<Meta<MultipleStoryArgs>>;

const items = [
  [
    "q1",
    "چطور رمز عبور را تغییر دهم؟",
    "از بخش پروفایل گزینهٔ «تغییر رمز» را انتخاب کنید.",
  ],
  ["q2", "چگونه نقش جدید بسازم؟", "در مدیریت نقش‌ها روی «افزودن نقش» بزنید."],
  ["q3", "گزارش ممیزی کجاست؟", "در منوی سیستم، بخش «گزارش ممیزی»."],
] as const;

export const Single: SingleStory = {
  args: {
    collapsible: true,
    defaultValue: "q1",
  },
  render: ({ collapsible, defaultValue }) => (
    <Accordion
      type="single"
      collapsible={collapsible}
      defaultValue={defaultValue}
      dir="rtl"
    >
      {items.map(([value, title, body]) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent>{body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: MultipleStory = {
  args: {
    defaultValue: ["q1", "q2"],
  },
  render: ({ defaultValue }) => (
    <Accordion type="multiple" defaultValue={defaultValue} dir="rtl">
      {items.map(([value, title, body]) => (
        <AccordionItem key={value} value={value}>
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent>{body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
