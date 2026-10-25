export class TranscriptionReceivedEvent {
  readonly type = "transcription.received";
  readonly occurredAt = new Date();

  constructor(
    public readonly conversationId: string,
    public readonly correlationId: string,
    public readonly text: string,
  ) {}
}
