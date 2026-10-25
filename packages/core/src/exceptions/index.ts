export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainException";
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "UnauthorizedException";
  }
}

export class TenantNotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "TenantNotFoundException";
  }
}

export class NotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
  }
}

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = "ValidationException";
  }
}
