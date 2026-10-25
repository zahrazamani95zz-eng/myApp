"use client";

import { SuggestedPrompts } from "./SuggestedPrompts";
import { WelcomeCard } from "./WelcomeCard";

export function EmptyState() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="w-full max-w-3xl px-6">
        <WelcomeCard />

        <div className="mt-10">
          <SuggestedPrompts />
        </div>
      </div>
    </div>
  );
}
