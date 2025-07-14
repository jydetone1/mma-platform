import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from 'src/domain/entities/ranking.entity';
import { FightHistory } from 'src/domain/entities/fight-history.entity';
import { CreateRankingInput } from 'src/application/dtos/create-ranking.input';
import { InjectQueue } from '@nestjs/bull';
import { Fighter } from 'src/domain/entities/fighter.entity';
import { checkDateFormat } from 'src/common/constant';
import { Queue } from 'bull';

@Injectable()
export class RankingService {
  constructor(
    @InjectRepository(Ranking)
    private readonly rankingRepository: Repository<Ranking>,
    @InjectRepository(FightHistory)
    private readonly fightHistoryRepository: Repository<FightHistory>,
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
    @InjectQueue('ranking') private readonly rankingQueue: Queue,
  ) {}

  async create(input: CreateRankingInput): Promise<Ranking> {
    const fighter = await this.fighterRepository.findOne({
      where: { id: input.fighterId },
    });
    if (!fighter)
      throw new NotFoundException(
        `Fighter with ID ${input.fighterId} not found`,
      );

    const ranking = this.rankingRepository.create({
      ...input,
      fighter,
      lastFightDate: checkDateFormat(input.lastFightDate),
    });
    return this.rankingRepository.save(ranking);
  }

  async queueRankingUpdate(fightId: number) {
    await this.rankingQueue.add('update-rankings', { fightId });
  }

  async updateRankings(fightId: number) {
    const fightHistories = await this.fightHistoryRepository.find({
      where: { fight: { id: fightId } },
      relations: ['fighter', 'fight'],
    });

    for (const history of fightHistories) {
      const fighter = history.fighter;
      const points = this.calculatePoints(history.outcome, history.method);
      await this.updateFighterRanking(fighter, points);
    }

    await this.sortRankings(fightHistories[0]?.fighter.weightClass);
  }

  private calculatePoints(outcome: string, method: string): number {
    if (outcome === 'win') {
      return method === 'knockout' || method === 'submission' ? 4 : 3;
    }
    return outcome === 'draw' ? 1 : 0;
  }

  private async updateFighterRanking(
    fighter: Record<string, any>,
    points: number,
  ) {
    let ranking = await this.rankingRepository.findOne({
      where: { fighter: { id: fighter.id }, weightClass: fighter.weightClass },
    });

    if (!ranking) {
      ranking = this.rankingRepository.create({
        fighter,
        weightClass: fighter.weightClass,
        points: 0,
        rankPosition: 0,
        winPercentage: 0,
      });
    }

    const fightHistory = await this.fightHistoryRepository
      .createQueryBuilder('fightHistory')
      .leftJoinAndSelect('fightHistory.fight', 'fight')
      .where('fightHistory.fighterId = :fighterId', { fighterId: fighter.id })
      .orderBy('fight.createdAt', 'DESC')
      .getMany();

    const wins = fightHistory.filter((h) => h.outcome === 'win').length;
    const totalFights = fightHistory.length;
    const winPercentage = totalFights > 0 ? (wins / totalFights) * 100 : 0;
    const lastFightDate =
      totalFights > 0 && fightHistory[0].fight.createdAt
        ? new Date(fightHistory[0].fight.createdAt)
        : null;

    ranking.points += points;
    ranking.winPercentage = winPercentage;
    ranking.lastFightDate = lastFightDate;

    await this.rankingRepository.save(ranking);
  }

  private async sortRankings(weightClass: string) {
    if (!weightClass) {
      throw new NotFoundException('No weight class provided for ranking sort');
    }

    const rankings = await this.rankingRepository.find({
      where: { weightClass },
      relations: ['fighter'],
    });

    const sorted = rankings.sort((a, b) => {
      if (a.points !== b.points) return b.points - a.points;
      if (a.winPercentage !== b.winPercentage)
        return b.winPercentage - a.winPercentage;
      const aDate = a.lastFightDate ? a.lastFightDate.getTime() : 0;
      const bDate = b.lastFightDate ? b.lastFightDate.getTime() : 0;
      return bDate - aDate;
    });

    await Promise.all(
      sorted.map((ranking, index) =>
        this.rankingRepository.update(ranking.id, { rankPosition: index + 1 }),
      ),
    );
  }

  async findAll({ weightClass }: { weightClass?: string }): Promise<Ranking[]> {
    const query = this.rankingRepository.createQueryBuilder('ranking');
    if (weightClass)
      query.where('ranking.weightClass = :weightClass', { weightClass });

    const ranks = await query.getMany();
    return ranks.map((rank) => ({
      ...rank,
      lastFightDate: checkDateFormat(rank.lastFightDate),
    }));
  }
}
