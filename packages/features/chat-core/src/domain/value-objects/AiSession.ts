export interface AiSessionProps {
  chatId: string;
  tenantId: string;
  userId: string;
}

export class AiSession {
  private constructor(private readonly props: AiSessionProps) {}

  static create(props: AiSessionProps): AiSession {
    return new AiSession(props);
  }

  get chatId(): string {
    return this.props.chatId;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get userId(): string {
    return this.props.userId;
  }

  withChatId(chatId: string): AiSession {
    return AiSession.create({ ...this.props, chatId });
  }

  toJSON(): AiSessionProps {
    return { ...this.props };
  }
}
