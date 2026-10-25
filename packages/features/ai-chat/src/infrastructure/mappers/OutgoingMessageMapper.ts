import type { Message } from "@super-app/features-chat-core/domain";

export class OutgoingMessageMapper {
  static toPayload(message: Message) {
    return {
      project_type: "rag",

      prompt: message.content.text,

      correlation_id: message.id,
    };
  }
}
