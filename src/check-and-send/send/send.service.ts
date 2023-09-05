import { Injectable } from '@nestjs/common';
import { Change } from 'src/ranking/change-detection/change-detection.service';
import axios from 'axios';

@Injectable()
export class SendService {
    calculateEmbedColor(level: number) {
       return ((Math.floor(level / 400 * 221) + 32) * 256 + (Math.floor(level / 400 * (-112)) + 120)) * 256 + Math.floor(level / 400 * (-204)) + 217;
    }

    createEmbed(change: Change) {
        const { profile, nick, level } = change;
        const embed = {
            'title': `${nick} dedł na ${level} level!`,
            'color': this.calculateEmbedColor(level),
            'description': `${(new Date).toLocaleString()}`,
            'url': profile,
            'thumbnail': {
                'url': 'https://i.imgur.com/WSmrePb.jpg'
            }
        };
        return embed;
    }
    async sendToDiscord(change: Change) {
        const embed = this.createEmbed(change);
        await axios.post("https://discord.com/api/webhooks/1129022957910507621/XeSf9spm9RHu50_MGn6EHIjh5vNVacDa4eqmrw8zOKxez60P8NZWbuR0ADpsBTCnczO-", {
            embeds: [embed],
            content: `${change.level >= 150 ? "@everyone" : ""}`
        })
    }
}
