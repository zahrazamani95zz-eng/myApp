import { BaseEntity, type BaseEntityProps } from "@super-app/core/domain";
import { IdGenerator } from "@super-app/core";

import { ConversationType } from "../enums";
import { AiSession } from "../value-objects";

export interface ConversationProps extends BaseEntityProps {
  title?: string;

  type: ConversationType;

  participantIds: string[];

  lastMessageId?: string;

  isPinned?: boolean;

  aiSession?: AiSession;

  last_message: string;

  // last_activity: Date;
}

export class Conversation extends BaseEntity<ConversationProps> {
  private constructor(props: ConversationProps) {
    super(props);
  }

  static create(
    props: Omit<ConversationProps, "id" | "createdAt" | "updatedAt">,
  ) {
    return new Conversation({
      ...props,

      id: IdGenerator.create(),

      createdAt: new Date(),

      updatedAt: new Date(),

      //  last_activity: new Date(),

      last_message: "",
    });
  }

  static reconstitute(props: ConversationProps): Conversation {
    return new Conversation(props);
  }

  rename(title: string) {
    this.props.title = title;

    this.touch();
  }

  setLastMessage(messageId: string) {
    this.props.lastMessageId = messageId;

    this.touch();
  }

  addParticipant(participantId: string) {
    if (!this.props.participantIds.includes(participantId)) {
      this.props.participantIds.push(participantId);

      this.touch();
    }
  }

  removeParticipant(participantId: string) {
    this.props.participantIds = this.props.participantIds.filter(
      (id) => id !== participantId,
    );

    this.touch();
  }

  get title() {
    return this.props.title;
  }

  get type() {
    return this.props.type;
  }

  get participantIds() {
    return [...this.props.participantIds];
  }

  get lastMessageId() {
    return this.props.lastMessageId;
  }

  get last_message() {
    return this.props.last_message;
  }

  get isPinned() {
    return this.props.isPinned ?? false;
  }

  get aiSession() {
    return this.props.aiSession;
  }

  setAiSession(session?: AiSession) {
    this.props.aiSession = session;
    this.touch();
  }
}
