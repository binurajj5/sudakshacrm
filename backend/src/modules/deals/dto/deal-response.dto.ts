import { DealStage } from '@prisma/client';

export class DealResponseDto {
  id: string;
  title: string;
  amount: number;
  stage: DealStage;
  contactId: string;
  companyId?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  contact?: any;
  company?: any;
  createdBy?: any;
  activities?: any[];
}
