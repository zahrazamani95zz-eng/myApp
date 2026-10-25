// import { Conversation, Participant } from "../../domain";

// import { ChatSession } from "../../domain";

// import {
//   ConversationType,
//   //ParticipantRole
// } from "../../domain";

// import type { ChatRepository } from "../ports";

// export interface CreateConversationRequest {
//   id: string;

//   title: string;

//   type: ConversationType;

//   participants: Participant[];
// }

// export class CreateConversationUseCase {
//   constructor(private readonly repository: ChatRepository) {}

//   async execute(request: CreateConversationRequest): Promise<ChatSession> {
//     const conversation = Conversation.create({
//       id: request.id,

//       title: request.title,

//       type: request.type,

//       participants: request.participants,
//     });

//     const session = new ChatSession({
//       conversation,

//       messages: [],
//     });

//     await this.repository.saveSession(session);

//     return session;
//   }
// }
