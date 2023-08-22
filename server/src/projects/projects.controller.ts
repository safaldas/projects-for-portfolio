import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { GetByIdDto, PaginationDto } from '../common/dto';
import { AuthenticatedGuard } from '../auth/guards';
import {
  ApiPaginatedResponse,
  CurrentUser,
  GetIdFromParams,
} from '../common/decorators';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiCookieAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from './dto';
import { ProjectsFilterDto } from './dto/projects-filter.dto';
import { User } from '@prisma/client';
import { AssignUserToTaskDto } from '../usertasks/dto/assignUserToTask.dto';
import { UpdateTaskStatusDto } from '../usertasks/dto/updateTaskStatus.dto';
import { UsertasksService } from '../usertasks/usertasks.service';
import { UserTaskDto } from '../usertasks/dto/UserTask.dto';
import { GetUserTaskDto } from '../usertasks/dto/GetUserTasks.dto';
import { AssignProjectDto } from './assignProject.dto';

@ApiTags('Projects') // This adds a tag to the Swagger documentation for the controller
@UseGuards(AuthenticatedGuard)
@Controller('projects')
@ApiCookieAuth()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly userTasksService: UsertasksService,
  ) {}

  @ApiOperation({ summary: 'Create a new Project' })
  @ApiCreatedResponse({
    type: ProjectDto,
  })
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.create(createProjectDto, user);
  }

  @ApiOperation({
    summary: 'Get list of items with pagination, filter and search also',
  })
  @ApiPaginatedResponse(ProjectDto)
  @ApiOkResponse({
    description: 'Projects retrieved successfully',
    type: [ProjectDto],
  })
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: ProjectsFilterDto,
  ) {
    return this.projectsService.findAll(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiOkResponse({
    description: 'Project retrieved successfully',
    type: ProjectDto,
  })
  @Get(':id')
  findOne(@GetIdFromParams('id') id: GetByIdDto) {
    return this.projectsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiOkResponse({
    description: 'Project updated successfully',
    type: ProjectDto,
  })
  @Patch(':id')
  update(
    @GetIdFromParams('id') id: GetByIdDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiOkResponse({
    description: 'Project removed successfully',
    type: ProjectDto,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@GetIdFromParams('id') id: GetByIdDto) {
    return this.projectsService.remove(+id);
  }

  @ApiOperation({
    summary: 'Assign project to current user ',
    description:
      'Use this api to assign the project and subsequently all tasks of this project to current user',
  })
  @ApiOkResponse({
    description: 'Project assigned successfully',
    type: AssignProjectDto,
  })
  @Post(':id/assign')
  @HttpCode(HttpStatus.OK)
  assignProjectToUser(
    @Param('id', ParseIntPipe) projectId: number,
    @CurrentUser() user: User,
  ) {
    return this.projectsService.assignProjectToUser(projectId, user.id);
  }

  @ApiOperation({ summary: 'Assign task to the user of this project' })
  @ApiOkResponse({
    description: 'Task assigned successfully',
    type: UserTaskDto,
  })
  @Post(':id/mytasks')
  assignTaskToUser(
    @Body() assignUserToTaskDto: AssignUserToTaskDto,
    @CurrentUser() user: User,
  ) {
    return this.userTasksService.assignTaskToUser(assignUserToTaskDto, user.id);
  }

  @ApiOperation({ summary: 'Get tasks of the user of this project' })
  @ApiOkResponse({
    description: 'Tasks retrieved successfully',
    type: [GetUserTaskDto],
  })
  @Get(':id/mytasks')
  findTasks(@GetIdFromParams('id') id: GetByIdDto, @CurrentUser() user: User) {
    return this.projectsService.findTasksByUserAndByProjectId(user.id, +id);
  }

  @ApiOperation({
    summary: 'Update task status by the user of this project',
    description:
      'The userTaskId of the task. This is not the task id but the relation between user and task. this is recieved in the get /projects/$S{projectId}/tasks api',
  })
  @ApiOkResponse({
    description: 'Tasks assigned successfully',
    type: UserTaskDto,
  })
  @Patch(':projectId/mytasks/:taskId/status')
  updateUserTaskStatus(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ) {
    return this.userTasksService.updateUserTaskStatus(updateTaskStatusDto);
  }
}
