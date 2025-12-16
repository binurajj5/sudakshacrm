import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsNumber, 
  IsBoolean, 
  MinLength, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { CourseCategory, CourseLevel, CourseStatus } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CourseCategory)
  category: CourseCategory;

  @IsNumber()
  @Type(() => Number)
  @Min(1)
  duration: number;

  @IsEnum(CourseLevel)
  level: CourseLevel;

  @IsString()
  @IsOptional()
  version?: string;

  @IsEnum(CourseStatus)
  status: CourseStatus;

  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean;

  @IsString()
  @IsOptional()
  lmsIdentifier?: string;

  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @IsString()
  @IsOptional()
  syllabusPdfUrl?: string;

  @IsString()
  @IsOptional()
  marketingContent?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  price?: number;
}
