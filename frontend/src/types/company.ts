export enum CompanyType {
  INSTITUTIONAL = 'INSTITUTIONAL',
  CORPORATE = 'CORPORATE',
  GOVERNMENT = 'GOVERNMENT',
  NGO = 'NGO',
  STARTUP = 'STARTUP',
  SME = 'SME',
}

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PROSPECT = 'PROSPECT',
  CHURNED = 'CHURNED',
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status: CompanyStatus;
  notes?: string;
  ownerId: string;
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  _count?: {
    contacts: number;
    deals: number;
    activities: number;
  };
}

export interface CreateCompanyDto {
  name: string;
  type: CompanyType;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  employeeCount?: number;
  annualRevenue?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  status?: CompanyStatus;
  notes?: string;
}

export type UpdateCompanyDto = Partial<CreateCompanyDto>
