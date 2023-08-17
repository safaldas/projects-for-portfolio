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
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { GetByIdDto, PaginationDto } from '../common/dto';
import { AuthenticatedGuard } from '../auth/guards';
import { ApiPaginatedResponse, GetIdFromParams } from '../common/decorators';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiCookieAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateProjectDto, ProjectDto, UpdateProjectDto } from './dto';
import { ProjectsFilterDto } from './dto/projects-filter.dto';

@ApiTags('Projects') // This adds a tag to the Swagger documentation for the controller
@UseGuards(AuthenticatedGuard)
@Controller('projects')
@ApiCookieAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({ summary: 'Create a new Project' })
  @ApiCreatedResponse({
    type: ProjectDto,
  })
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
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
}
