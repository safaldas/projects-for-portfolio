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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { FilterDto, GetByIdDto, PaginationDto } from '../common/dto';
import { AuthenticatedGuard } from '../auth/guards';
import { ApiPaginatedResponse, GetIdFromParams } from '../common/decorators';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { Project } from '@prisma/client';

@ApiTags('Projects') // This adds a tag to the Swagger documentation for the controller
@UseGuards(AuthenticatedGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  @ApiCookieAuth()
  @ApiCreatedResponse()
  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @ApiPaginatedResponse(CreateProjectDto)
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto,
  ) {
    return this.projectsService.findAll(paginationDto, filterDto);
  }

  @Get(':id')
  findOne(@GetIdFromParams('id') id: GetByIdDto) {
    return this.projectsService.findOne(+id);
  }

  @ApiOkResponse({ description: 'Project updated successfully' })
  @Patch(':id')
  update(
    @GetIdFromParams('id') id: GetByIdDto,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @ApiOkResponse({ description: 'Project removed successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@GetIdFromParams('id') id: GetByIdDto) {
    return this.projectsService.remove(+id);
  }
}
