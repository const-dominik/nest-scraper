import { Test, TestingModule } from '@nestjs/testing';
import { ChangeDetectionService } from './change-detection.service';

describe('ChangeDetectionService', () => {
  let service: ChangeDetectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChangeDetectionService],
    }).compile();

    service = module.get<ChangeDetectionService>(ChangeDetectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
