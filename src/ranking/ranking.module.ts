import { Module } from '@nestjs/common';
import { ChangeDetectionService } from './change-detection/change-detection.service';

@Module({
  providers: [ChangeDetectionService],
  exports: [ChangeDetectionService]
})
export class RankingModule {}
