import { MessageReceivedEvent } from "./MessageReceivedEvent";
import { TypingEvent } from "./TypingEvent";
import { ReactionEvent } from "./ReactionEvent";
import { ReadReceiptEvent } from "./ReadReceiptEvent";

export type ChatEvent =
  | MessageReceivedEvent
  | TypingEvent
  | ReactionEvent
  | ReadReceiptEvent;
