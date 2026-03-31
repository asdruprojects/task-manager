import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ToggleTaskDto } from './dto/toggle-task.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(
    @CurrentUser('id') userId: number,
    @Query() query: PaginationQueryDto,
  ) {
    return this.tasksService.findAll(userId, query);
  }

  @Post()
  create(@CurrentUser('id') userId: number, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(userId, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, userId, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
  ) {
    return this.tasksService.remove(id, userId);
  }

  @Put(':id/toggle')
  toggle(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('id') userId: number,
    @Body() dto: ToggleTaskDto,
  ) {
    return this.tasksService.toggle(id, userId, dto.completed);
  }
}
