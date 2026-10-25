import { BaseEntity, type BaseEntityProps } from "./BaseEntity";

export abstract class AggregateRoot<
  T extends BaseEntityProps,
> extends BaseEntity<T> {}
