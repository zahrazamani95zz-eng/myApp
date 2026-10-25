import type { UploadRepository } from "../../application";

import { Attachment, AttachmentType } from "../../domain";

export class LocalUploadRepository implements UploadRepository {
  async upload(file: File): Promise<Attachment> {
    const url = URL.createObjectURL(file);

    return Attachment.create({
      url,

      fileName: file.name,

      mimeType: file.type,

      type: this.resolveType(file.type),

      size: file.size,
    });
  }

  private resolveType(mimeType: string): AttachmentType {
    if (mimeType.startsWith("image/")) {
      return AttachmentType.IMAGE;
    }

    if (mimeType.startsWith("video/")) {
      return AttachmentType.VIDEO;
    }

    if (mimeType.startsWith("audio/")) {
      return AttachmentType.AUDIO;
    }

    return AttachmentType.FILE;
  }
}
