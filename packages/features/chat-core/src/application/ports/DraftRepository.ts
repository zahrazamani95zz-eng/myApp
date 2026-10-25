export interface DraftRepository {
  saveDraft(conversationId: string, text: string): Promise<void>;

  getDraft(conversationId: string): Promise<string | null>;

  removeDraft(conversationId: string): Promise<void>;
}
