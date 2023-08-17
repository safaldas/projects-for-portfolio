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
import { AuthenticatedGuard } from '../auth/guards';
import { GetByIdDto, PaginationDto } from '../common/dto';
import { ApiPaginatedResponse, GetIdFromParams } from '../common/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { CreateTagDto, TagDto, UpdateTagDto } from './dto';
import { TagFilterDto } from './dto/tag-filter.dto';

@UseGuards(AuthenticatedGuard)
@ApiCookieAuth()
@ApiTags('Tags') // Set the API tag for this controller
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create a new tag' })
  @ApiCreatedResponse({
    type: TagDto,
  })
  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @ApiOperation({
    summary: 'Get list of items with pagination, filter and search also',
  })
  @ApiPaginatedResponse(TagDto)
  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: TagFilterDto,
  ) {
    return this.tagsService.findAll(paginationDto, filterDto);
  }

  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Tag ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully retrieved the tag',
    type: TagDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get(':id')
  findOne(
    @GetIdFromParams('id')
    id: GetByIdDto,
  ) {
    return this.tagsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Tag ID', example: 1 })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tag updated successfully',
    type: TagDto,
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
    type: TagDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Tag not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
