import { Conversation, ConversationType } from "../../domain";
import { ChatRepository } from "../ports";

export class EnsureConversationUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(conversationId: string) {
    const existing = await this.repository.loadConversation(conversationId);

    if (existing) return existing;

    const conversation = Conversation.create({
      title: "",

      type: ConversationType.PRIVATE,

      participantIds: [],

      lastMessageId: undefined,

      isPinned: false,

      last_message: "",
    });

    await this.repository.ensureConversation(conversation);

    return conversation;
  }
}
