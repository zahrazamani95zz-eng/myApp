"use client";

import { ConversationItem } from "./ConversationItem";

import { ConversationListProps } from "./ConversationList.types";

export function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  onPin,
  onDelete,
}: ConversationListProps) {
  if (!conversations.length) {
    return (
      <div className="p-6 text-center text-sm text-text-muted">
        No conversations
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          active={conversation.id === activeConversationId}
          onClick={() => onSelect(conversation.id)}
          onPin={onPin}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
