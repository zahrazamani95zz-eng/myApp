export interface BaseEntityProps {
  id: string;

  createdAt: Date;

  updatedAt: Date;
}

export abstract class BaseEntity<T extends BaseEntityProps> {
  protected constructor(protected props: T) {}

  get id(): string {
    return this.props.id;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  protected touch() {
    this.props.updatedAt = new Date();
  }

  equals(entity: BaseEntity<T>): boolean {
    return this.id === entity.id;
  }
}
