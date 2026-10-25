import type { ChatHistoryGateway } from "../ports/ChatHistoryGateway";
import type { ChatRepository } from "../ports/ChatRepository";

export class LoadConversationContentUseCase {
  constructor(
    private readonly repository: ChatRepository,
    private readonly api: ChatHistoryGateway,
  ) {}

  async execute(chatId: string, page: number = 1, perPage: number = 20) {
    try {
      const result = await this.api.loadConversationContent(
        chatId,
        page,
        perPage,
      );

      // The content API has no stable message id/correlation id. Reconcile
      // only exact local user/assistant messages that are close in time so a
      // locally persisted message is not duplicated in IndexedDB.
      const localMessages = await this.repository.loadMessages(chatId);
      const unmatchedLocal = [...localMessages];
      const matchedLocalIds = new Set<string>();
      const maxClockSkewMs = 5 * 60 * 1000;

      for (const remote of result.items) {
        const remoteText = remote.content.text;
        const remoteTime = remote.createdAt.getTime();
        const matchIndex = unmatchedLocal.findIndex((local) => {
          if (matchedLocalIds.has(local.id)) return false;
          if (local.senderId !== remote.senderId) return false;
          if (local.content.text !== remoteText) return false;

          return (
            Math.abs(local.createdAt.getTime() - remoteTime) <= maxClockSkewMs
          );
        });

        if (matchIndex >= 0) {
          const [matched] = unmatchedLocal.splice(matchIndex, 1);
          matchedLocalIds.add(matched.id);

          if (matched.audioId) {
            remote.setAudioMetadata({
              audioId: matched.audioId,
              audioUrl: matched.audioUrl,
              audioFormat: matched.audioFormat,
              durationMs: matched.durationMs,
            });
          }

          if (matched.feedback) {
            remote.setFeedback(matched.feedback);
          }

          if (matched.transcription) {
            remote.setTranscription(matched.transcription);
          }

          if (matched.error) {
            remote.setError(matched.error);
          }

          await this.repository.deleteMessage(matched.id);
        }
      }

      await this.repository.saveMessages(result.items);

      return result;
    } catch (error) {
      const messages = await this.repository.loadMessages(chatId);

      if (messages.length > 0) {
        return {
          items: messages,
          page: 1,
          hasMore: false,
          warning:
            error instanceof Error
              ? error.message
              : "دریافت مکالمه از سرویس انجام نشد. پیام‌های ذخیره‌شده نمایش داده می‌شوند.",
        };
      }

      throw error;
    }
  }
}
