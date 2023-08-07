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
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { AuthenticatedGuard } from '../auth/guards';
import { FilterDto, GetByIdDto, PaginationDto } from '../common/dto';
import { GetIdFromParams } from '../common/decorators';

@UseGuards(AuthenticatedGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto,
  ) {
    return this.tasksService.findAll(paginationDto, filterDto);
  }

  @Get(':id')
  findOne(
    @GetIdFromParams('id')
    id: GetByIdDto,
  ) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @GetIdFromParams('id')
    id: GetByIdDto,
    @Body() updateTaskDto: UpdateDto,
  ) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
