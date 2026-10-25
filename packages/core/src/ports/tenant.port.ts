import { Tenant } from "../domain/entities/tenant.entity";

export interface TenantPort {
  getTenantById(id: string): Promise<Tenant>;
  getTenantBySlug(slug: string): Promise<Tenant>;
  getTenantByDomain(domain: string): Promise<Tenant>;
  updateTenantConfig(id: string, config: Partial<unknown>): Promise<Tenant>;
  getActiveTenants(): Promise<Tenant[]>;
  createTenant(tenant: Tenant): Promise<Tenant>;
}
