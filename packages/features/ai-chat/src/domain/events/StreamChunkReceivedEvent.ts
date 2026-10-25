export class StreamChunkReceivedEvent {
  readonly type = "message.chunk";
  readonly occurredAt = new Date();

  constructor(
    public readonly chatId: string,
    public readonly correlationId: string,
    public readonly content: string,
    public readonly done: boolean,
  ) {}
}
