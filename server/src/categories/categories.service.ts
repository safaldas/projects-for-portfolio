import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/services/pagination.service';
import { Category } from '@prisma/client';
import { FilterDto, PaginationDto } from '../common/dto';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.prisma.category.create({ data: createCategoryDto });
      return category;
    } catch (error) {
      console.log({ error });
      return new UnprocessableEntityException();
    }
  }

  findAll(paginationDto: PaginationDto, filterDto?: FilterDto) {
    return this.paginationService.findAll('category', paginationDto, filterDto);
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (category) return category;
    else {
      return new NotFoundException();
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    if (category) return category;
  }

  async remove(id: number) {
    const category = await this.prisma.category.delete({
      where: { id },
    });
    return category;
  }
}
