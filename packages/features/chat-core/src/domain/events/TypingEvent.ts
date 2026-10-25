export class TypingEvent {
  readonly type = "typing.started";

  readonly occurredAt = new Date();

  constructor(
    public readonly conversationId: string,
    public readonly userId: string,
  ) {}
}
