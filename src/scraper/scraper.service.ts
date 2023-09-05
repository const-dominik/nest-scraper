import { Injectable } from '@nestjs/common';
import { createWindow } from 'domino';
import axios from 'axios';

export type Ranking = Record<string, Record<string, { nick: string, level: number }>>
export class RankingEntry {
    constructor(
        public accountId: string, 
        public characterId: string, 
        public nick: string, 
        public level: number
    ) {};
}

@Injectable()
export class ScraperService {
    extractIds(link: string): [accountId: string, characterId: string] {
        const [accountId, characterId] = link.match(/(\d+)/g);
        return [accountId, characterId];
    }

    async getDocument(URL: string) {
        const response = await axios.get(URL);
        const window = createWindow(response.data);
        return window.document;
    }

    async getPagesNumber() {
        const document = await this.getDocument('https://www.margonem.pl/ladder/players,Berufs');
        const pagesElement = document.querySelector(".total-pages a");
        const pages = Number(pagesElement.textContent);
        return pages;
    }

    async fetchRanking(page: number): Promise<RankingEntry[]> {
        const URL = `https://www.margonem.pl/ladder/players,Berufs?page=${page}`;
        const response = await axios.get(URL);
        const document = createWindow(response.data).document;
        const allEntries = Array.from(document.querySelectorAll("tbody tr"));
        const parsedEntries = allEntries.map((entry: Element) => {
            const a = entry.querySelector("a");
            const nick = a.textContent.trim();
            const link = a.getAttribute("href");
            const [accountId, characterId] = this.extractIds(link);
            const lvl = entry.querySelector(".long-level").textContent;
            return new RankingEntry(accountId, characterId, nick, Number(lvl));
        });
        return parsedEntries;
    }

    async getPages(ranking: Ranking, to: number, from = 1) {
        for (let i = from; i <= to; i++) {
            try {
                const page = await this.fetchRanking(i);
                page.forEach(entry => {
                    const { accountId, characterId, nick, level } = entry;
                    if (!ranking[accountId]) ranking[accountId] = {};
                    ranking[accountId][characterId] = {
                        level,
                        nick
                    }
                });
            } catch (e) {
                console.error(`Failed to fetch ${i} page.`);
            }
            //give the little server some break
            await new Promise(r => setTimeout(r, 3000));
        }
    }

    async fetchWholeRanking(): Promise<Ranking> {
        const pages = await this.getPagesNumber();
        const ranking: Ranking = {};
        await this.getPages(ranking, pages)
        const pages2 = await this.getPagesNumber();
        if (pages2 > pages) {
            await this.getPages(ranking, pages+1, pages2);
        }
        return ranking;
    }
}