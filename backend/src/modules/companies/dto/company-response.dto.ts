import { CompanyType } from '@prisma/client';

export class CompanyResponseDto {
  id: string;
  name: string;
  type: CompanyType;
  website?: string;
  industry?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: any;
  contacts?: any[];
  deals?: any[];
  _count?: {
    contacts: number;
    deals: number;
  };
}
