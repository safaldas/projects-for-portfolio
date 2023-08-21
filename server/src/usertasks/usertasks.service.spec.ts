import { Test, TestingModule } from '@nestjs/testing';
import { UsertasksService } from './usertasks.service';

describe('UsertasksService', () => {
  let service: UsertasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsertasksService],
    }).compile();

    service = module.get<UsertasksService>(UsertasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
