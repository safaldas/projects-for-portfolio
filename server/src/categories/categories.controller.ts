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
import {
  ApiPaginatedResponse,
  CurrentUser,
  GetIdFromParams,
} from '../common/decorators';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiTags,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { User } from '@prisma/client';
import { Role } from '../common/enums/roles.enum';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Categories')
@UseGuards(AuthenticatedGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new category. Scope: [admin]' })
  @Post()
  @ApiCreatedResponse({
    description: 'The category has been created successfully',
    type: CategoryDto,
  })
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() user: User,
  ) {
    return this.categoriesService.create(createCategoryDto, user);
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

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: Number, description: ' ID', example: 1 })
  @ApiOperation({ summary: 'Update a category by ID. Scope: [admin]' })
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

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'id', type: Number, description: ' ID', example: 1 })
  @ApiOperation({ summary: 'Delete a category by ID. Scope: [admin]' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @ApiNoContentResponse({
    description: 'Category deleted successfully',
  })
  remove(@GetIdFromParams('id') id: GetByIdDto) {
    return this.categoriesService.remove(+id);
  }
}
