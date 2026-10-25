import type { ChatHistoryGateway, ChatRepository } from "../ports";

export class SendMessageFeedbackUseCase {
  constructor(
    private readonly apiGateway: ChatHistoryGateway,
    private readonly repository: ChatRepository,
  ) {}

  async execute(input: { messageId: string; isLike: boolean }): Promise<void> {
    await this.apiGateway.sendMessageFeedback(input.messageId, input.isLike);

    await this.repository.updateMessageFeedback(
      input.messageId,
      input.isLike ? "like" : "dislike",
    );
  }
}
