import type { DraftRepository } from "../../application";

import {
  ChatDatabase,
  chatDatabase as defaultChatDatabase,
} from "../database/ChatDatabase";

export class IndexedDbDraftRepository implements DraftRepository {
  private readonly database: ChatDatabase;

  constructor(database: ChatDatabase = defaultChatDatabase) {
    this.database = database;
  }

  async saveDraft(conversationId: string, text: string): Promise<void> {
    await this.database.drafts.put({
      conversationId,
      text,
      updatedAt: new Date(),
    });
  }

  async getDraft(conversationId: string): Promise<string | null> {
    const draft = await this.database.drafts.get(conversationId);

    return draft?.text ?? null;
  }

  async removeDraft(conversationId: string): Promise<void> {
    await this.database.drafts.delete(conversationId);
  }
}
