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
    include?: any, // Use Prisma types for includes
  ): Promise<{
    data: T[];
    meta: { page: number; limit: number; totalItems: number };
  }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const where = filterDto
      ? await this.buildWhereFilter(filterDto, model)
      : {};
    const orderBy = filterDto
      ? await this.buildOrderByFilter(filterDto, model)
      : {};
    const data = await this.prisma[model].findMany({
      skip,
      take: limit,
      where,
      include,
      orderBy,
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

  private async buildOrderByFilter(filterDto: FilterDto, model: string) {
    const orderBy: any = {};
    if (filterDto.orderByAsc) {
      orderBy[filterDto.orderByAsc] = 'asc';
    }
    if (filterDto.orderByDesc) {
      orderBy[filterDto.orderByDesc] = 'desc';
    }
    return orderBy;
  }
  private async buildWhereFilter(filterDto: FilterDto, model: string) {
    // Build the where object based on the properties in the FilterDto
    const where: any = {};

    if (filterDto.name) {
      where.name = { equals: filterDto.name };
    }
    if (filterDto.category) {
      where.categories = { some: { id: filterDto.category } };
    }
    if (filterDto.tag) {
      where.tags = { some: { id: filterDto.tag } };
    }
    if (filterDto.user) {
      where.users = { some: { id: filterDto.user } };
    }
    if (filterDto.q) {
      const orConditions = []; // Initialize an array to hold OR conditions

      orConditions.push({ name: { contains: filterDto.q } });

      const exists = await this.checkPropertyExists(model, 'description');
      if (exists) {
        orConditions.push({ description: { contains: filterDto.q } });
      }

      // Add more conditions here if needed

      // Add the OR conditions to the where object if there are any
      if (orConditions.length > 0) {
        where.OR = orConditions;
      }
    }

    // Add more filter queries here
    if (filterDto.status) {
      where.status = { equals: filterDto.status };
    }
    // console.log(JSON.stringify(where, null, 2));

    return where;
  }
  async checkPropertyExists(model: string, property: string): Promise<boolean> {
    try {
      const modelSchema = this.prisma[model].fields;

      return property in modelSchema;
    } catch (error) {
      // Handle errors (e.g., model does not exist)
      return false;
    }
  }
}
