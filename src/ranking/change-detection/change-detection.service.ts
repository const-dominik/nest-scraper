import { Injectable } from '@nestjs/common';
import * as fs from "node:fs";
import { Ranking } from 'src/scraper/scraper.service';

export type Change = {
    profile: string,
    nick: string,
    level: number
}

@Injectable()
export class ChangeDetectionService {
    detectChange(ranking: Ranking): Change[] {
        let oldRanking: Ranking;
        const changes: Change[] = [];
        try {
            //using fs.stat is not recommended to check file existance,
            //instead you should just open it and handle error if file isn't available
            oldRanking = JSON.parse(fs.readFileSync("./ranking.txt", { encoding: "utf8" }));
        } catch (e) {
            oldRanking = {};
        }
        Object.entries(ranking).forEach(([accountId, characters]) => {
            Object.entries(characters).forEach(([characterId, { nick, level }]) => {
                if (!oldRanking[accountId] || !oldRanking[accountId][characterId]) {
                    return;
                }
                const oldPlayer = oldRanking[accountId][characterId];
                const player = ranking[accountId][characterId];
                if (oldPlayer.level > player.level) {
                    const profileLink = `https://www.margonem.pl/profile/view,${accountId}#char_${characterId},berufs`;
                    changes.push({
                        profile: profileLink,
                        nick,
                        level: oldPlayer.level
                    });
                }
            })
        });
        fs.writeFileSync("./ranking.txt", JSON.stringify(ranking));
        return changes;
    }
}
