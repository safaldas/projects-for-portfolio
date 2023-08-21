import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthenticatedGuard } from '../auth/guards';
import { GetByIdDto, PaginationDto } from '../common/dto';
import {
  ApiPaginatedResponse,
  CurrentUser,
  GetIdFromParams,
} from '../common/decorators';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateTaskDto, TaskDto, TaskFilterDto, UpdateTaskDto } from './dto';
import { User } from '@prisma/client';

@ApiTags('Tasks')
@UseGuards(AuthenticatedGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a new Task' })
  @Post()
  @ApiCreatedResponse({
    description: 'The task has been successfully created',
    type: TaskDto,
  })
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @ApiOperation({
    summary: 'Get list of items with pagination, filter and search also',
  })
  @Get()
  @ApiPaginatedResponse(TaskDto)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: TaskFilterDto,
  ) {
    return this.tasksService.findAll(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID' })
  @Get(':id')
  @ApiOkResponse({
    description: 'The task with the given ID',
    type: TaskDto,
  })
  findOne(
    @GetIdFromParams('id')
    id: GetByIdDto,
  ) {
    return this.tasksService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID' })
  @Patch(':id')
  @ApiOkResponse({
    description: 'Task successfully updated',
  })
  update(
    @GetIdFromParams('id')
    id: GetByIdDto,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', type: String, description: 'ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Task deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
