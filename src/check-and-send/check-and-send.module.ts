import { Module } from '@nestjs/common';
import { CheckService } from './check/check.service';
import { SendService } from './send/send.service';
import { ScraperModule } from 'src/scraper/scraper.module';
import { RankingModule } from 'src/ranking/ranking.module';

@Module({
  providers: [CheckService, SendService],
  imports: [ScraperModule, RankingModule],
  exports: [CheckService, SendService]
})
export class CheckAndSendModule {}
