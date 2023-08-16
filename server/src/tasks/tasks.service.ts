import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaginationService } from '../common/services/pagination.service';
import { Task } from '@prisma/client';
import { FilterDto, PaginationDto } from '../common/dto';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const task = await this.prisma.task.create({ data: createTaskDto });
      return task;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException('Invalid project ID');
      }
      throw new UnprocessableEntityException();
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

  async update(id: number, updateDto: UpdateTaskDto) {
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
