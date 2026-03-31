import { IsBoolean } from 'class-validator';

export class ToggleTaskDto {
  @IsBoolean()
  completed: boolean;
}
