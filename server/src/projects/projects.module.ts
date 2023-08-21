import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsertasksService } from '../usertasks/usertasks.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, UsertasksService],
})
export class ProjectsModule {}
