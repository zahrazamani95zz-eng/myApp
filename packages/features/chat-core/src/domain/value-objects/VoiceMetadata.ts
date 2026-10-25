export interface VoiceMetadataProps {
  duration: number;

  sampleRate: number;

  codec: string;
}

export class VoiceMetadata {
  constructor(private readonly props: VoiceMetadataProps) {}

  get duration() {
    return this.props.duration;
  }

  get sampleRate() {
    return this.props.sampleRate;
  }

  get codec() {
    return this.props.codec;
  }
}
