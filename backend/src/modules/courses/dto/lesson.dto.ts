import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  IsUrl,
  MinLength,
  Min,
} from 'class-validator';
import { LessonContentType } from '@prisma/client';

export class CreateLessonDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(LessonContentType)
  contentType: LessonContentType;

  @IsOptional()
  @IsUrl()
  contentUrl?: string;

  @IsNumber()
  @Min(0)
  orderIndex: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsString()
  lmsIdentifier?: string;
}

export class UpdateLessonDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(LessonContentType)
  contentType?: LessonContentType;

  @IsOptional()
  @IsUrl()
  contentUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsBoolean()
  isFree?: boolean;

  @IsOptional()
  @IsString()
  lmsIdentifier?: string;
}
