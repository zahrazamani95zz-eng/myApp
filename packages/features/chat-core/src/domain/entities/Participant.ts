import { BaseEntity, type BaseEntityProps } from "@super-app/core/domain";
import { IdGenerator } from "@super-app/core";

import { ParticipantRole } from "../enums";

export interface ParticipantProps extends BaseEntityProps {
  displayName: string;

  avatarUrl?: string;

  role: ParticipantRole;

  isOnline: boolean;
}

export class Participant extends BaseEntity<ParticipantProps> {
  private constructor(props: ParticipantProps) {
    super(props);
  }

  static create(
    props: Omit<ParticipantProps, "id" | "createdAt" | "updatedAt">,
  ) {
    return new Participant({
      ...props,

      id: IdGenerator.create(),

      createdAt: new Date(),

      updatedAt: new Date(),
    });
  }

  static reconstitute(props: ParticipantProps): Participant {
    return new Participant(props);
  }

  rename(name: string) {
    this.props.displayName = name;

    this.touch();
  }

  setAvatar(url?: string) {
    this.props.avatarUrl = url;

    this.touch();
  }

  online() {
    this.props.isOnline = true;

    this.touch();
  }

  offline() {
    this.props.isOnline = false;

    this.touch();
  }

  get displayName() {
    return this.props.displayName;
  }

  get avatarUrl() {
    return this.props.avatarUrl;
  }

  get role() {
    return this.props.role;
  }

  get isOnline() {
    return this.props.isOnline;
  }
}
