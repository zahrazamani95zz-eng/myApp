export class IdGenerator {
  static create(): string {
    return crypto.randomUUID();
  }
}
