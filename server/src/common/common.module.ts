import { Global, Module } from '@nestjs/common';
import { PaginationService } from './services/pagination.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  providers: [
    PaginationService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [PaginationService],
})
export class CommonModule {}
