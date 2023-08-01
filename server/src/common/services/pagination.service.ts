import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto, FilterDto } from '../dto';

@Injectable()
export class PaginationService<T> {
  constructor(private prisma: PrismaService) {}

  async findAll(
    model: string,
    paginationDto: PaginationDto,
    filterDto?: FilterDto,
    include?: any,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = filterDto ? this.buildWhereFilter(filterDto) : {};

    const data = await this.prisma[model].findMany({
      skip,
      take: limit,
      where,
      include,
    });

    const totalItems = await this.prisma[model].count({ where });

    return {
      data,
      meta: {
        page,
        limit,
        totalItems,
      },
    };
  }

  private buildWhereFilter(filterDto: FilterDto) {
    // Build the where object based on the properties in the FilterDto
    const where: any = {};

    if (filterDto.name) {
      where.name = { contains: filterDto.name };
    }
    if (filterDto.category) {
      where.category = { equals: filterDto.category };
    }
    if (filterDto.tag) {
      where.tag = { equals: filterDto.tag };
    }
    // TODO: from here
    if (filterDto.q) {
      // where.name = { contains: filterDto.name };
    }
    // Add other filtering properties as needed

    return where;
  }
}
