export class ReactionEvent {
  readonly type = "reaction.received";

  readonly occurredAt = new Date();

  constructor(
    public readonly conversationId: string,
    public readonly messageId: string,
    public readonly userId: string,
    public readonly emoji: string,
  ) {}
}
