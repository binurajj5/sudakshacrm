import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsInt, 
  IsBoolean, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { LessonContentType } from '@prisma/client';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(LessonContentType)
  contentType: LessonContentType;

  @IsString()
  @IsOptional()
  contentUrl?: string;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  orderIndex: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  durationMinutes?: number;

  @IsBoolean()
  @IsOptional()
  isFree?: boolean;

  @IsString()
  @IsOptional()
  lmsIdentifier?: string;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
