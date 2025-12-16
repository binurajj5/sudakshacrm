import { ContactType, ContactStatus } from '@prisma/client';

export class ContactResponseDto {
  id: string;
  type: ContactType;
  status: ContactStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  company?: any;
  createdBy?: any;
  deals?: any[];
  activities?: any[];
}
