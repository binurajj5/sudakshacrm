import { IsString, IsNumber, IsOptional, IsEnum, MinLength, Min } from 'class-validator';
import { DealStage } from '@prisma/client';

export class CreateDealDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @IsString()
  contactId: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
