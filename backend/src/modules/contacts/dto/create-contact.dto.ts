import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ContactType, ContactStatus } from '@prisma/client';

export class CreateContactDto {
  @IsEnum(ContactType)
  type: ContactType;

  @IsEnum(ContactStatus)
  @IsOptional()
  status?: ContactStatus;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  companyId?: string;
}
