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
import { CategoryService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { AuthenticatedGuard } from '../auth/guards';
import { FilterDto, GetByIdDto, PaginationDto } from '../common/dto';
import { GetIdFromParams } from '../common/decorators';

@UseGuards(AuthenticatedGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoriesService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto,
  ) {
    return this.categoriesService.findAll(paginationDto, filterDto);
  }

  @Get(':id')
  findOne(@GetIdFromParams('id') id: GetByIdDto) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @GetIdFromParams('id') id: GetByIdDto,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@GetIdFromParams('id') id: GetByIdDto) {
    return this.categoriesService.remove(+id);
  }
}
