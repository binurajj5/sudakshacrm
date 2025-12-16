import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsInt, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Type(() => Number)
  @Min(0)
  orderIndex: number;

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Min(0)
  estimatedHours?: number;
}

export class UpdateModuleDto extends PartialType(CreateModuleDto) {}
