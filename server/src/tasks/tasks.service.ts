import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/services/pagination.service';
import { Task } from '@prisma/client';
import { FilterDto, PaginationDto } from '../common/dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService<Task>,
  ) {}

  create(createTaskDto: CreateDto) {
    try {
      const task = this.prisma.task.create({ data: createTaskDto });
      return task;
    } catch (error) {
      console.log({ error });
      return new UnprocessableEntityException();
    }
  }

  findAll(paginationDto: PaginationDto, filterDto?: FilterDto) {
    return this.paginationService.findAll('task', paginationDto, filterDto);
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (task) return task;
    else {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateDto: UpdateDto) {
    const task = await this.prisma.task.update({
      where: { id },
      data: updateDto,
    });
    if (task) return task;
  }

  async remove(id: number) {
    const task = await this.prisma.task.delete({
      where: { id },
    });
    return task;
  }
}
