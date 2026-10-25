export class ReadReceiptEvent {
  readonly type = "read.receipt";

  readonly occurredAt = new Date();

  constructor(
    public readonly messageId: string,
    public readonly userId: string,
  ) {}
}
