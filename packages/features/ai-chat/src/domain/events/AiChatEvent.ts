import type { ChatEvent as CoreChatEvent } from "@super-app/features-chat-core/domain";
import { StreamChunkReceivedEvent } from "./StreamChunkReceivedEvent";
import { TranscriptionReceivedEvent } from "./TranscriptionReceivedEvent";

export type AiChatEvent =
  | CoreChatEvent
  | StreamChunkReceivedEvent
  | TranscriptionReceivedEvent;
