import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
