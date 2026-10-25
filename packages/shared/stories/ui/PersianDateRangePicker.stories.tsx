import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  PersianDateRangePicker,
  type PersianDateRange,
} from "../../src/ui/persian-date-picker";

const meta = {
  title: "UI/Forms/PersianDateRangePicker",
  component: PersianDateRangePicker,
  parameters: {
    layout: "padded",
    docs: { story: { inline: false, iframeHeight: 520 } },
  },
  args: {
    value: { from: null, to: null },
    onChange: () => undefined,
  },
  argTypes: {
    numberOfMonths: { control: "inline-radio", options: [1, 2, 3, 4] },
  },
} satisfies Meta<typeof PersianDateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled({ numberOfMonths }: { numberOfMonths?: 1 | 2 | 3 | 4 }) {
  const [value, setValue] = useState<PersianDateRange>({
    from: null,
    to: null,
  });

  return (
    <div className="max-w-sm space-y-3">
      <PersianDateRangePicker
        value={value}
        onChange={setValue}
        numberOfMonths={numberOfMonths}
      />
      <p className="text-xs text-text-muted" dir="ltr">
        {value.from?.toISOString() ?? "—"} → {value.to?.toISOString() ?? "—"}
      </p>
    </div>
  );
}

export const Default: Story = {
  render: (args) => <Controlled numberOfMonths={args.numberOfMonths} />,
};

export const TwoMonths: Story = {
  render: () => <Controlled numberOfMonths={2} />,
};
