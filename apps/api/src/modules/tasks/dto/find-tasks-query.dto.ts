import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export enum TaskStatus {
  ALL = 'all',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export class FindTasksQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus = TaskStatus.ALL;
}
