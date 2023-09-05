import { Module } from '@nestjs/common';
import { ScraperModule } from './scraper/scraper.module';
import { RankingModule } from './ranking/ranking.module';
import { CheckAndSendModule } from './check-and-send/check-and-send.module';
import { CheckService } from './check-and-send/check/check.service';
import { SendService } from './check-and-send/send/send.service';
import { ChangeDetectionService } from './ranking/change-detection/change-detection.service';

@Module({
  imports: [ScraperModule, RankingModule, CheckAndSendModule],
})
export class AppModule {}
