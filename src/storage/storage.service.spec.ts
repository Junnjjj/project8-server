import { Test, TestingModule } from '@nestjs/testing';
import { GcpstorageService } from './storage.service';

describe('GcpstorageService', () => {
  let service: GcpstorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GcpstorageService],
    }).compile();

    service = module.get<GcpstorageService>(GcpstorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
