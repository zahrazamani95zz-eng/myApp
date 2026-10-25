export class AudioDuration {
  private constructor(private readonly seconds: number) {}

  static create(seconds: number): AudioDuration {
    if (seconds < 0) {
      throw new Error("Duration cannot be negative.");
    }

    return new AudioDuration(seconds);
  }

  get value(): number {
    return this.seconds;
  }

  toMilliseconds(): number {
    return this.seconds * 1000;
  }

  equals(other: AudioDuration): boolean {
    return this.seconds === other.seconds;
  }
}
