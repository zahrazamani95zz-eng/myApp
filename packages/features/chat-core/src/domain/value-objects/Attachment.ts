import { IdGenerator } from "@super-app/core";
import { AttachmentType } from "../enums";

export interface AttachmentProps {
  id: string;

  url: string;

  fileName: string;

  mimeType: string;

  type: AttachmentType;

  size: number;
}

export class Attachment {
  private constructor(private readonly props: AttachmentProps) {}

  static create(props: Omit<AttachmentProps, "id">): Attachment {
    return new Attachment({
      ...props,

      id: IdGenerator.create(),
    });
  }

  static reconstitute(props: AttachmentProps): Attachment {
    return new Attachment(props);
  }

  get id() {
    return this.props.id;
  }

  get url() {
    return this.props.url;
  }

  get fileName() {
    return this.props.fileName;
  }

  get mimeType() {
    return this.props.mimeType;
  }

  get type() {
    return this.props.type;
  }

  get size() {
    return this.props.size;
  }
}
