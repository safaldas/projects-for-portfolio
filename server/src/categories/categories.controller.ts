import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from './dto';
import { AuthenticatedGuard } from '../auth/guards';
import { GetByIdDto, PaginationDto } from '../common/dto';
import { ApiPaginatedResponse, GetIdFromParams } from '../common/decorators';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CategoryFilterDto } from './dto/category-filter.dto';

@ApiTags('Categories')
@UseGuards(AuthenticatedGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @ApiOperation({ summary: 'Create a new category' })
  @Post()
  @ApiCreatedResponse({
    description: 'The category has been created successfully',
    type: CategoryDto,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({
    summary: 'Get list of items with pagination, filter and search also',
  })
  @Get()
  @ApiPaginatedResponse(CategoryDto)
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: CategoryFilterDto,
  ) {
    return this.categoriesService.findAll(paginationDto, filterDto);
  }

  @ApiParam({ name: 'id', type: Number, description: ' ID', example: 1 })
  @ApiOperation({ summary: 'Get a category by ID' })
  @Get(':id')
  @ApiOkResponse({
    description: 'Category found successfully',
    type: CategoryDto,
  })
  findOne(@GetIdFromParams('id') id: GetByIdDto) {
    return this.categoriesService.findOne(+id);
  }

  @ApiParam({ name: 'id', type: Number, description: ' ID', example: 1 })
  @ApiOperation({ summary: 'Update a category by ID' })
  @Patch(':id')
  @ApiOkResponse({
    description: 'Category updated successfully',
    type: CategoryDto,
  })
  update(
    @GetIdFromParams('id') id: GetByIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @ApiParam({ name: 'id', type: Number, description: ' ID', example: 1 })
  @ApiOperation({ summary: 'Delete a category by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Category deleted successfully',
  })
  remove(@GetIdFromParams('id') id: GetByIdDto) {
    return this.categoriesService.remove(+id);
  }
}
