import { BaseEntity, type BaseEntityProps } from "@super-app/core/domain";
//import { IdGenerator } from "@super-app/core";

import { MessageStatus, MessageType } from "../enums";
import { Attachment, MessageContent } from "../value-objects";

export interface MessageProps extends BaseEntityProps {
  conversationId: string;

  senderId: string;

  type: MessageType;

  status: MessageStatus;

  content: MessageContent;

  attachments: Attachment[];

  replyToMessageId?: string;

  correlationId?: string;

  audioId?: string;
  audioUrl?: string;
  audioFormat?: string;
  durationMs?: number;

  feedback?: "like" | "dislike";

  transcription?: string;

  error?: string;
}

export class Message extends BaseEntity<MessageProps> {
  private constructor(props: MessageProps) {
    super(props);
  }

  static create(props: Omit<MessageProps, "createdAt" | "updatedAt">) {
    return new Message({
      ...props,
      attachments: props.attachments ?? [],

      id: props.id,

      createdAt: new Date(),

      updatedAt: new Date(),
    });
  }

  static reconstitute(props: MessageProps): Message {
    return new Message(props);
  }

  canEdit(): boolean {
    if (this.status === MessageStatus.DELETED) {
      return false;
    }

    if (this.type === MessageType.SYSTEM) {
      return false;
    }

    if (Date.now() - this.createdAt.getTime() > 15 * 60 * 1000) {
      return false;
    }

    return true;
  }

  edit(content: string): void {
    if (!this.canEdit()) {
      throw new Error("Message cannot be edited.");
    }

    this.props.content = MessageContent.create(content);

    this.touch();
  }

  markDeleted(): void {
    this.props.status = MessageStatus.DELETED;

    this.touch();
  }

  addAttachment(attachment: Attachment): void {
    this.props.attachments.push(attachment);

    this.touch();
  }

  setCorrelationId(correlationId: string): void {
    this.props.correlationId = correlationId;
    this.touch();
  }

  moveToConversation(conversationId: string): void {
    this.props.conversationId = conversationId;
    this.touch();
  }

  markSent(): void {
    this.props.status = MessageStatus.SENT;

    this.touch();
  }

  setAudioMetadata(metadata: {
    audioId: string;
    audioUrl?: string;
    audioFormat?: string;
    durationMs?: number;
  }): void {
    this.props.audioId = metadata.audioId;
    this.props.audioUrl = metadata.audioUrl;
    this.props.audioFormat = metadata.audioFormat;
    this.props.durationMs = metadata.durationMs;
    this.touch();
  }

  markFailed(): void {
    this.props.status = MessageStatus.FAILED;

    this.touch();
  }

  setFeedback(feedback: "like" | "dislike"): void {
    this.props.feedback = feedback;
    this.touch();
  }

  setTranscription(transcription: string): void {
    this.props.transcription = transcription;
    this.touch();
  }

  setError(error?: string): void {
    this.props.error = error;
    this.touch();
  }

  get conversationId() {
    return this.props.conversationId;
  }

  get senderId() {
    return this.props.senderId;
  }

  get type() {
    return this.props.type;
  }

  get status() {
    return this.props.status;
  }

  get content() {
    return this.props.content;
  }

  get replyToMessageId() {
    return this.props.replyToMessageId;
  }

  get correlationId() {
    return this.props.correlationId;
  }

  get audioId() {
    return this.props.audioId;
  }

  get audioUrl() {
    return this.props.audioUrl;
  }

  get audioFormat() {
    return this.props.audioFormat;
  }

  get durationMs() {
    return this.props.durationMs;
  }

  get feedback() {
    return this.props.feedback;
  }

  get transcription() {
    return this.props.transcription;
  }

  get error() {
    return this.props.error;
  }

  get attachments() {
    return [...this.props.attachments];
  }
}
