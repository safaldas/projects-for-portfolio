import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/services/pagination.service';
import { Tag } from '@prisma/client';
import { FilterDto, PaginationDto } from '../common/dto';

@Injectable()
export class TagsService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService<Tag>,
  ) {}

  create(createTagDto: CreateTagDto) {
    try {
      const tag = this.prisma.tag.create({ data: createTagDto });
      return tag;
    } catch (error) {
      console.log({ error });
      return new UnprocessableEntityException();
    }
  }

  findAll(paginationDto: PaginationDto, filterDto?: FilterDto) {
    return this.paginationService.findAll('tag', paginationDto, filterDto);
  }

  async findOne(id: number) {
    const tag = await this.prisma.tag.findUnique({ where: { id } });
    if (tag) return tag;
    else {
      return new NotFoundException();
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.prisma.tag.update({
      where: { id },
      data: updateTagDto,
    });
    if (tag) return tag;
  }

  async remove(id: number) {
    const tag = await this.prisma.tag.delete({
      where: { id },
    });
    return tag;
  }
}
