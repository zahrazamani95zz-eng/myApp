export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: string,
  ) {}

  static create(amount: number, currency: string = "IRR"): Money {
    if (amount < 0) {
      throw new Error("Amount cannot be negative");
    }
    if (!currency) {
      throw new Error("Currency is required");
    }
    return new Money(amount, currency);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error("Cannot add money with different currencies");
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error("Cannot subtract money with different currencies");
    }
    if (this._amount < other._amount) {
      throw new Error("Insufficient funds");
    }
    return new Money(this._amount - other._amount, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  toString(): string {
    return `${this._amount.toLocaleString()} ${this._currency}`;
  }
}
