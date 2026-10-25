import type { Message } from "../entities";

export class MessageReceivedEvent {
  readonly type = "message.received";

  readonly occurredAt = new Date();

  constructor(public readonly message: Message) {}
}
