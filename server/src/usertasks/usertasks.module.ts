import { Module } from '@nestjs/common';
import { UsertasksService } from './usertasks.service';

@Module({
  providers: [UsertasksService],
})
export class UsertasksModule {}
