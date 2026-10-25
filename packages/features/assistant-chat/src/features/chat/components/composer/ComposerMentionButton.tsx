"use client";

import { AtSign } from "lucide-react";
import { Button } from "@super-app/shared/ui";

export function ComposerMentionButton() {
  function handleClick() {
    console.log("Mention clicked");
  }

  return (
    <Button type="button" variant="ghost" onClick={handleClick}>
      <AtSign size={18} />
    </Button>
  );
}
