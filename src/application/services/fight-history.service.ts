import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FightHistory } from 'src/domain/entities/fight-history.entity';

@Injectable()
export class FightHistoryService {
  constructor(
    @InjectRepository(FightHistory)
    private readonly fightHistoryRepository: Repository<FightHistory>,
  ) {}

  async findById(id: number): Promise<FightHistory> {
    const fightHistory = await this.fightHistoryRepository.findOne({
      where: { id },
      relations: ['fighter', 'fight'],
    });
    if (!fightHistory)
      throw new NotFoundException(`FightHistory with ID ${id} not found`);
    return fightHistory;
  }

  async findAll({
    fighterId,
    fightId,
  }: {
    fighterId?: number;
    fightId?: number;
  }): Promise<FightHistory[]> {
    const query = this.fightHistoryRepository
      .createQueryBuilder('fightHistory')
      .leftJoinAndSelect('fightHistory.fighter', 'fighter')
      .leftJoinAndSelect('fightHistory.fight', 'fight');
    if (fighterId) query.andWhere('fighter.id = :fighterId', { fighterId });
    if (fightId) query.andWhere('fight.id = :fightId', { fightId });
    return query.getMany();
  }

  async updateFightHistory(
    fightId: number,
    fighterId: number,
    input: { outcome: string; method?: string },
  ): Promise<void> {
    let fightHistory = await this.fightHistoryRepository.findOne({
      where: { fight: { id: fightId }, fighter: { id: fighterId } },
    });

    if (!fightHistory) {
      fightHistory = this.fightHistoryRepository.create({
        fight: { id: fightId },
        fighter: { id: fighterId },
        outcome: input.outcome,
        method: input.method,
      });
    } else {
      fightHistory.outcome = input.outcome;
      fightHistory.method = input.method;
    }

    await this.fightHistoryRepository.save(fightHistory);
  }
}
