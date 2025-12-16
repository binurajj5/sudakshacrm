import { IsString, IsOptional, IsNumber, MinLength, Min } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  orderIndex: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;
}

export class UpdateTopicDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  duration?: number;
}
