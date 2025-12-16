import { ActivityType } from '@prisma/client';

export class ActivityResponseDto {
  id: string;
  type: ActivityType;
  subject: string;
  description?: string;
  scheduledAt?: Date;
  completed: boolean;
  completedAt?: Date;
  contactId?: string;
  companyId?: string;
  dealId?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  contact?: any;
  company?: any;
  deal?: any;
  createdBy?: any;
}
