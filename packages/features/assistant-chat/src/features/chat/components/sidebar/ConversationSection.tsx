"use client";

import { ConversationList } from "./ConversationList";

import type { ConversationGroup } from "../../types/ConversationGroup";

interface Props {
  section: ConversationGroup;

  activeConversationId?: string;

  onSelect(id: string): void;

  onPin(id: string): void;

  onDelete(id: string): void;
}

export function ConversationSection({
  section,
  activeConversationId,
  onSelect,
  onPin,
  onDelete,
}: Props) {
  return (
    <section className="space-y-4">
      <h3 className="px-3 text-xs font-medium text-text-secondary">
        {section.title}
      </h3>

      <ConversationList
        conversations={section.conversations}
        activeConversationId={activeConversationId}
        onSelect={onSelect}
        onPin={onPin}
        onDelete={onDelete}
      />
    </section>
  );
}
