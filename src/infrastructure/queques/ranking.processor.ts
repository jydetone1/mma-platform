import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { RankingService } from '../../application/services/ranking.service';

@Processor('ranking')
export class RankingProcessor {
  constructor(private readonly rankingService: RankingService) {}

  @Process('update-rankings')
  async handleUpdateRankings(job: Job<{ fightId: number }>) {
    const { fightId } = job.data;
    await this.rankingService.updateRankings(fightId);
  }
}
