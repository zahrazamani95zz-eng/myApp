export class MimeType {
  private constructor(private readonly value: string) {}

  static create(type: string): MimeType {
    if (!type.includes("/")) {
      throw new Error("Invalid mime type.");
    }

    return new MimeType(type);
  }

  get text(): string {
    return this.value;
  }

  isImage(): boolean {
    return this.value.startsWith("image/");
  }

  isVideo(): boolean {
    return this.value.startsWith("video/");
  }

  isAudio(): boolean {
    return this.value.startsWith("audio/");
  }

  isPdf(): boolean {
    return this.value === "application/pdf";
  }

  equals(other: MimeType): boolean {
    return this.value === other.value;
  }
}
