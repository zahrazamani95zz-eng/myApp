import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxTrigger,
} from "../../src/ui/combobox";
import { Button } from "../../src/ui/button";

const meta = {
  title: "UI/Forms/Combobox",
  component: Combobox,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const cities = ["تهران", "اصفهان", "شیراز", "تبریز", "مشهد", "رشت"];

function SearchableCities() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<string | null>(null);

  const filtered = cities.filter((city) => city.includes(query));

  return (
    <Combobox open={open} onOpenChange={setOpen}>
      <ComboboxTrigger asChild>
        <Button variant="outline" className="w-56 justify-between">
          {value ?? "انتخاب شهر"}
        </Button>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput
          placeholder="جستجو..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {filtered.length === 0 && (
          <div className="py-4 text-center text-sm text-text-muted">
            موردی یافت نشد
          </div>
        )}
        {filtered.map((city) => (
          <ComboboxItem
            key={city}
            onClick={() => {
              setValue(city);
              setOpen(false);
            }}
          >
            {city}
          </ComboboxItem>
        ))}
      </ComboboxContent>
    </Combobox>
  );
}

export const Default: Story = {
  render: () => <SearchableCities />,
};
