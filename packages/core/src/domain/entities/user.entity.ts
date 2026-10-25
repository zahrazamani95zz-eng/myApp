export interface UserProps {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee" | "user";
  tenantId: string;
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: Omit<UserProps, "createdAt" | "updatedAt">): User {
    return new User({
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: UserProps): User {
    return new User(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get role(): "admin" | "employee" | "user" {
    return this.props.role;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get permissions(): string[] {
    return [...this.props.permissions];
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business Logic Methods
  hasPermission(permission: string): boolean {
    return this.props.permissions.includes(permission);
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((p) => this.hasPermission(p));
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((p) => this.hasPermission(p));
  }

  isAdmin(): boolean {
    return this.props.role === "admin";
  }

  isEmployee(): boolean {
    return this.props.role === "employee";
  }

  isUser(): boolean {
    return this.props.role === "user";
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateRole(role: "admin" | "employee" | "user"): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }

  addPermission(permission: string): void {
    if (!this.props.permissions.includes(permission)) {
      this.props.permissions.push(permission);
      this.props.updatedAt = new Date();
    }
  }

  removePermission(permission: string): void {
    this.props.permissions = this.props.permissions.filter(
      (p) => p !== permission,
    );
    this.props.updatedAt = new Date();
  }

  toJSON(): UserProps {
    return {
      ...this.props,
      permissions: [...this.props.permissions],
    };
  }
}
