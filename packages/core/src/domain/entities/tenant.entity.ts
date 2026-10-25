export interface TenantConfig {
  timezone: string;
  currency: string;
  language: string;
  dateFormat: string;
}

export interface FeatureFlags {
  chat: boolean;
  banking: boolean;
  stock: boolean;
  ai: boolean;
  documents: boolean;
  payments: boolean;
}

export type FeatureKey = keyof FeatureFlags;

export type ThemeMode = Record<string, string>;

export interface ThemeConfig {
  defaultMode: "light" | "dark";

  modes: {
    light: ThemeMode;
    dark: ThemeMode;
  };
}

export interface TenantProps {
  id: string;
  name: string;
  slug: string;
  config: TenantConfig;
  features: FeatureFlags;
  theme: ThemeConfig;
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export class Tenant {
  private constructor(private props: TenantProps) {}

  static create(
    props: Omit<TenantProps, "createdAt" | "updatedAt" | "status">,
  ): Tenant {
    return new Tenant({
      ...props,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static restore(props: TenantProps): Tenant {
    return new Tenant(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get slug(): string {
    return this.props.slug;
  }

  get config(): TenantConfig {
    return { ...this.props.config };
  }

  get features(): FeatureFlags {
    return { ...this.props.features };
  }

  get theme(): ThemeConfig {
    return { ...this.props.theme };
  }

  get status(): "active" | "inactive" | "suspended" {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business Logic Methods
  isActive(): boolean {
    return this.props.status === "active";
  }

  hasFeature(feature: FeatureKey): boolean {
    return this.props.features[feature] === true;
  }

  getTheme(): ThemeConfig {
    return this.props.theme;
  }

  activate(): void {
    this.props.status = "active";
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.status = "inactive";
    this.props.updatedAt = new Date();
  }

  suspend(): void {
    this.props.status = "suspended";
    this.props.updatedAt = new Date();
  }

  updateConfig(config: Partial<TenantConfig>): void {
    this.props.config = { ...this.props.config, ...config };
    this.props.updatedAt = new Date();
  }

  updateFeatures(features: Partial<FeatureFlags>): void {
    this.props.features = { ...this.props.features, ...features };
    this.props.updatedAt = new Date();
  }

  updateTheme(theme: Partial<ThemeConfig>): void {
    this.props.theme = { ...this.props.theme, ...theme };
    this.props.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  toJSON(): TenantProps {
    return {
      ...this.props,
      config: { ...this.props.config },
      features: { ...this.props.features },
      theme: { ...this.props.theme },
    };
  }
}
