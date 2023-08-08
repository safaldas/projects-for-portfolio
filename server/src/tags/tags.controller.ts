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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { AuthenticatedGuard } from '../auth/guards';
import { FilterDto, GetByIdDto, PaginationDto } from '../common/dto';
import { GetIdFromParams } from '../common/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@UseGuards(AuthenticatedGuard)
@ApiTags('Tags') // Set the API tag for this controller
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiBody({ type: CreateTagDto })
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @ApiOperation({ summary: 'Get all tags' })
  @ApiQuery({ type: PaginationDto })
  @ApiQuery({ type: FilterDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved tags',
  })
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto,
  ) {
    return this.tagsService.findAll(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Tag ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the tag',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  @Get(':id')
  findOne(
    @GetIdFromParams('id')
    id: GetByIdDto,
  ) {
    return this.tagsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Tag ID' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tag updated successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  @Patch(':id')
  update(
    @GetIdFromParams('id')
    id: GetByIdDto,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Tag ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Tag deleted successfully',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
