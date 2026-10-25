export class FileSize {
  private constructor(private readonly bytes: number) {}

  static create(bytes: number): FileSize {
    if (bytes < 0) {
      throw new Error("File size cannot be negative.");
    }

    return new FileSize(bytes);
  }

  get value(): number {
    return this.bytes;
  }

  toMB(): number {
    return this.bytes / 1024 / 1024;
  }

  toKB(): number {
    return this.bytes / 1024;
  }

  equals(other: FileSize): boolean {
    return this.bytes === other.bytes;
  }
}
