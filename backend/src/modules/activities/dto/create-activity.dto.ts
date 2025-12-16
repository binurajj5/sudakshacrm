import { IsString, IsOptional, IsEnum, MinLength, IsDateString } from 'class-validator';
import { ActivityType } from '@prisma/client';

export class CreateActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  @MinLength(3)
  subject: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsString()
  @IsOptional()
  contactId?: string;

  @IsString()
  @IsOptional()
  companyId?: string;

  @IsString()
  @IsOptional()
  dealId?: string;
}
