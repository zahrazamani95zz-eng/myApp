import type { ChatRepository } from "../../application";

import {
  Conversation,
  ConversationPage,
  Message,
  MessageStatus,
} from "../../domain";

import {
  ChatDatabase,
  chatDatabase as defaultChatDatabase,
} from "../database/ChatDatabase";

import { ConversationMapper, MessageMapper } from "../mappers";

export class IndexedDbChatRepository implements ChatRepository {
  private readonly database: ChatDatabase;

  constructor(database: ChatDatabase = defaultChatDatabase) {
    this.database = database;
  }

  // ----------------------------
  // Conversation
  // ----------------------------

  async ensureConversation(conversation: Conversation): Promise<void> {
    const existing = await this.database.conversations.get(conversation.id);
    const persisted = ConversationMapper.toPersistence(conversation);

    if (!persisted.aiSession && existing?.aiSession) {
      persisted.aiSession = existing.aiSession;
    }

    await this.database.conversations.put(persisted);
  }

  async loadConversation(id: string): Promise<Conversation | null> {
    const record = await this.database.conversations.get(id);

    if (!record) return null;

    return ConversationMapper.toDomain(record);
  }

  async loadConversations(
    page: number,
    perPage: number,
  ): Promise<ConversationPage> {
    const conversations = await this.database.conversations
      .orderBy("updatedAt")
      .reverse()
      .offset((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    const total = await this.database.conversations.count();

    return {
      items: conversations.map(ConversationMapper.toDomain),

      page,

      hasMore: page * perPage < total,
    };
  }

  async replaceConversationId(
    temporaryId: string,
    conversationId: string,
  ): Promise<void> {
    if (temporaryId === conversationId) return;

    await this.database.transaction(
      "rw",
      this.database.conversations,
      this.database.messages,
      this.database.drafts,
      async () => {
        const temporary = await this.database.conversations.get(temporaryId);
        const real = await this.database.conversations.get(conversationId);

        if (temporary) {
          await this.database.conversations.put({
            ...(real ?? temporary),
            id: conversationId,
            title: real?.title || temporary.title,
            lastMessageId: real?.lastMessageId ?? temporary.lastMessageId,
            createdAt: real?.createdAt ?? temporary.createdAt,
            updatedAt: new Date(
              Math.max(
                real?.updatedAt.getTime() ?? 0,
                temporary.updatedAt.getTime(),
              ),
            ),
            isPinned: real?.isPinned ?? temporary.isPinned,
            aiSession: real?.aiSession
              ? { ...real.aiSession, chatId: conversationId }
              : temporary?.aiSession
                ? { ...temporary.aiSession, chatId: conversationId }
                : undefined,
          });

          await this.database.conversations.delete(temporaryId);
        }

        const messages = await this.database.messages
          .where("conversationId")
          .equals(temporaryId)
          .toArray();

        for (const message of messages) {
          await this.database.messages.put({
            ...message,
            conversationId,
            updatedAt: new Date(),
          });
        }

        const draft = await this.database.drafts.get(temporaryId);

        if (draft) {
          await this.database.drafts.put({
            ...draft,
            conversationId,
          });

          await this.database.drafts.delete(temporaryId);
        }
      },
    );
  }

  async deleteConversation(conversationId: string): Promise<void> {
    await this.database.transaction(
      "rw",
      this.database.conversations,
      this.database.messages,
      this.database.drafts,
      async () => {
        await this.database.conversations.delete(conversationId);
        await this.database.messages
          .where("conversationId")
          .equals(conversationId)
          .delete();
        await this.database.drafts.delete(conversationId);
      },
    );
  }
  // ----------------------------
  // Messages
  // ----------------------------

  async loadMessage(messageId: string): Promise<Message | null> {
    const record = await this.database.messages.get(messageId);

    if (!record) {
      return null;
    }

    return MessageMapper.toDomain(record);
  }

  async loadMessages(conversationId: string): Promise<Message[]> {
    const records = await this.database.messages
      .where("conversationId")
      .equals(conversationId)
      .sortBy("createdAt");

    return records.map(MessageMapper.toDomain);
  }

  async saveMessage(message: Message): Promise<void> {
    await this.database.messages.put(MessageMapper.toPersistence(message));
  }

  async saveMessages(messages: Message[]): Promise<void> {
    await this.database.messages.bulkPut(
      messages.map(MessageMapper.toPersistence),
    );
  }

  async updateMessage(message: Message): Promise<void> {
    await this.database.messages.put(MessageMapper.toPersistence(message));
  }

  async updateMessageStatus(
    messageId: string,
    status: MessageStatus,
  ): Promise<void> {
    await this.database.messages.update(messageId, {
      status,
      updatedAt: new Date(),
    });
  }

  async updateMessageFeedback(
    messageId: string,
    feedback: "like" | "dislike",
  ): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const updated = await this.database.messages.update(messageId, {
        feedback,
        updatedAt: new Date(),
      });

      if (updated > 0) return;

      const message = await this.database.messages
        .where("correlationId")
        .equals(messageId)
        .first();

      if (message) {
        await this.database.messages.update(message.id, {
          feedback,
          updatedAt: new Date(),
        });
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    throw new Error("Message not found while persisting feedback.");
  }

  async updateMessageTranscription(
    messageId: string,
    transcription: string,
  ): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const updated = await this.database.messages.update(messageId, {
        transcription,
        updatedAt: new Date(),
      });

      if (updated > 0) return;

      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    throw new Error("Message not found while persisting transcription.");
  }

  async updateMessageError(messageId: string, error?: string): Promise<void> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const updated = await this.database.messages.update(messageId, {
        error,
        updatedAt: new Date(),
      });

      if (updated > 0) return;

      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    throw new Error("Message not found while persisting error.");
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.database.messages.delete(messageId);
  }
}
