export class MessageContent {
  private constructor(private readonly value: string) {}

  static create(content: string): MessageContent {
    const normalized = content.trim();

    if (!normalized) {
      throw new Error("Message content cannot be empty.");
    }

    if (normalized.length > 10000) {
      throw new Error("Message content exceeds maximum length.");
    }

    return new MessageContent(normalized);
  }

  get text(): string {
    return this.value;
  }

  get length(): number {
    return this.value.length;
  }

  equals(other: MessageContent): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
