import { Injectable } from '@nestjs/common';
import { ChangeDetectionService } from 'src/ranking/change-detection/change-detection.service';
import { ScraperService } from 'src/scraper/scraper.service';
import { SendService } from '../send/send.service';

@Injectable()
export class CheckService {
    constructor(private readonly changeDetectionService: ChangeDetectionService,
                private readonly scraperService: ScraperService,
                private readonly sendService: SendService)
    {
        this.init();
    };

    async check() {
        console.time("start")
        const ranking = await this.scraperService.fetchWholeRanking();
        const rankingChanges = this.changeDetectionService.detectChange(ranking);
        for (const change of rankingChanges) {
            try {
                await this.sendService.sendToDiscord(change);
            } catch {
                console.error(`Failed to send: ${JSON.stringify(change)}`);
            }
        }
        console.timeEnd("start");
    }

    async init() {
        while (true)
            await this.check();
    }
}
