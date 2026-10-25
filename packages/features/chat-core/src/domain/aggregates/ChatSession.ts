import { Conversation, Message } from "../entities";

export interface ChatSessionProps {
  conversation: Conversation;

  messages: Message[];
}

export class ChatSession {
  constructor(private readonly props: ChatSessionProps) {}

  get conversation(): Conversation {
    return this.props.conversation;
  }

  get messages(): readonly Message[] {
    return this.props.messages;
  }

  appendMessage(message: Message): void {
    this.props.messages.push(message);

    this.props.conversation.setLastMessage(message.id);
  }

  findMessage(messageId: string): Message {
    const message = this.props.messages.find((m) => m.id === messageId);

    if (!message) {
      throw new Error("Message not found.");
    }

    return message;
  }

  removeMessage(messageId: string): void {
    const index = this.props.messages.findIndex((m) => m.id === messageId);

    if (index === -1) {
      throw new Error("Message not found.");
    }

    this.props.messages.splice(index, 1);
  }

  updateLastMessage(message: Message): void {
    this.props.conversation.setLastMessage(message.id);
  }
}
