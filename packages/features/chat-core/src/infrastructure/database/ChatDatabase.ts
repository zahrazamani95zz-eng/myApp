import Dexie, { type Table } from "dexie";

export interface ConversationRecord {
  id: string;

  title?: string;

  type: string;

  participantIds: string[];

  lastMessageId?: string;

  createdAt: Date;

  updatedAt: Date;

  isPinned: boolean;

  last_message: string;

  aiSession?: {
    chatId: string;
    tenantId: string;
    userId: string;
  };
}

export interface MessageRecord {
  id: string;

  conversationId: string;

  senderId: string;

  type: string;

  status: string;

  content: string;

  attachmentsJson: string;

  //correlationId: string;

  replyToMessageId?: string;

  createdAt: Date;

  updatedAt: Date;

  correlationId?: string;

  audioId?: string;
  audioUrl?: string;
  audioFormat?: string;
  durationMs?: number;
  feedback?: "like" | "dislike";
  transcription?: string;
  error?: string;
}

export interface DraftRecord {
  conversationId: string;

  text: string;

  updatedAt: Date;
}

export class ChatDatabase extends Dexie {
  conversations!: Table<ConversationRecord>;

  messages!: Table<MessageRecord>;

  drafts!: Table<DraftRecord>;

  constructor(
    databaseName = `super-app-chat-${process.env.NEXT_PUBLIC_APP_ID ?? "default"}`,
  ) {
    super(databaseName);

    this.version(1).stores({
      conversations: "&id,updatedAt",

      messages: "&id,conversationId,createdAt,status",

      drafts: "&conversationId",
    });

    this.version(2)
      .stores({
        conversations: "&id,updatedAt",
        messages: "&id,conversationId,createdAt,status",
        drafts: "&conversationId",
      })
      .upgrade(async (transaction) => {
        await transaction
          .table("conversations")
          .toCollection()
          .modify((record) => {
            if (!record.aiSession && record.tenantId && record.userId) {
              record.aiSession = {
                chatId: record.id,
                tenantId: record.tenantId,
                userId: record.userId,
              };
            }

            delete record.tenantId;
            delete record.userId;
          });
      });

    this.version(3).stores({
      conversations: "&id,updatedAt",
      messages: "&id,conversationId,createdAt,status,correlationId",
      drafts: "&conversationId",
    });
  }
}

export const chatDatabase = new ChatDatabase();
