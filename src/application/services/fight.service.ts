import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fight } from 'src/domain/entities/fight.entity';
import { RankingService } from './ranking.service';
import { CreateFightInput } from 'src/application/dtos/create-fight.input';
import { UpdateFightResultInput } from 'src/application/dtos/update-fight-results.input';
import { FightHistoryService } from './fight-history.service';
import { Event } from 'src/domain//entities/event.entity';
import { Fighter } from 'src/domain/entities/fighter.entity';

@Injectable()
export class FightService {
  constructor(
    @InjectRepository(Fight)
    private readonly fightRepository: Repository<Fight>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
    private readonly rankingService: RankingService,
    private readonly fightHistoryService: FightHistoryService,
  ) {}

  async create(input: CreateFightInput): Promise<Fight> {
    const { eventId, fighter1Id, fighter2Id } = input;

    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event)
      throw new NotFoundException(`Event with ID ${eventId} not found`);

    const fighter1 = await this.fighterRepository.findOne({
      where: { id: fighter1Id },
    });
    const fighter2 = await this.fighterRepository.findOne({
      where: { id: fighter2Id },
    });

    if (!fighter1)
      throw new NotFoundException(`Fighter with ID ${fighter1Id} not found`);

    if (!fighter2)
      throw new NotFoundException(`Fighter with ID ${fighter2Id} not found`);

    if (fighter1Id === fighter2Id)
      throw new Error('Fighter1 and Fighter2 must be different');

    const fight = this.fightRepository.create({
      event,
      fighter1,
      fighter2,
    });

    const savedFight = await this.fightRepository.save(fight);
    return this.fightRepository.findOne({
      where: { id: savedFight.id },
      relations: ['event', 'fighter1', 'fighter2', 'fightHistory'],
    });
  }

  async findById(id: number): Promise<Fight> {
    const fight = await this.fightRepository.findOne({
      where: { id },
      relations: ['event', 'fighter1', 'fighter2', 'fightHistory'],
    });
    if (!fight) throw new NotFoundException(`Fight  with ID ${id} not found`);
    if (
      fight.event &&
      fight.event.date &&
      typeof fight.event.date === 'string'
    ) {
      fight.event.date = new Date(fight.event.date);
    }
    return fight;
  }

  async findAll({
    eventId,
    fighterId,
  }: {
    eventId?: number;
    fighterId?: number;
  }): Promise<Fight[]> {
    const query = this.fightRepository
      .createQueryBuilder('fight')
      .leftJoinAndSelect('fight.event', 'event')
      .leftJoinAndSelect('fight.fighter1', 'fighter1')
      .leftJoinAndSelect('fight.fighter2', 'fighter2')
      .leftJoinAndSelect('fight.fightHistory', 'fightHistory');
    if (eventId) query.andWhere('event.id = :eventId', { eventId });
    if (fighterId) {
      query.andWhere('fighter1.id = :fighterId OR fighter2.id = :fighterId', {
        fighterId,
      });
    }

    return query.getMany();
  }

  async updateFightResult(
    id: number,
    input: UpdateFightResultInput,
  ): Promise<Fight> {
    const fight = await this.fightRepository.findOne({
      where: { id },
      relations: ['fighter1', 'fighter2'],
    });
    if (!fight) throw new NotFoundException(`Fight with ID ${id} not found`);

    await this.fightRepository.update(id, input);

    if (input.result) {
      const outcome1 =
        input.result === 'win'
          ? 'win'
          : input.result === 'loss'
            ? 'loss'
            : 'draw';
      const outcome2 =
        input.result === 'win'
          ? 'loss'
          : input.result === 'loss'
            ? 'win'
            : 'draw';

      await this.fightHistoryService.updateFightHistory(id, fight.fighter1.id, {
        outcome: outcome1,
        method: input.method,
      });
      await this.fightHistoryService.updateFightHistory(id, fight.fighter2.id, {
        outcome: outcome2,
        method: input.method,
      });
    }

    await this.rankingService.queueRankingUpdate(id);

    return this.fightRepository.findOne({
      where: { id },
      relations: ['event', 'fighter1', 'fighter2', 'fightHistory'],
    });
  }
}
