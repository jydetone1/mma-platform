import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fighter } from '../../domain/entities/fighter.entity';
import { CreateFighterInput } from '../dtos/create-fighter.input';
import { checkDateFormat } from 'src/common/constant';

@Injectable()
export class FighterService {
  constructor(
    @InjectRepository(Fighter)
    private readonly fighterRepository: Repository<Fighter>,
  ) {}

  async findById(id: number): Promise<Fighter> {
    const fighter = await this.fighterRepository.findOne({
      where: { id },
      relations: ['fightHistory'],
    });
    if (!fighter)
      throw new NotFoundException(`Fighter with  ID ${id} not found`);
    return {
      ...fighter,
      dateOfBirth: checkDateFormat(fighter.dateOfBirth),
    };
  }

  async findAll({
    weightClass,
    limit,
  }: {
    weightClass?: string;
    limit?: number;
  }): Promise<Fighter[]> {
    const query = this.fighterRepository.createQueryBuilder('fighter');
    if (weightClass)
      query.where('fighter.weightClass =:weightClass', { weightClass });
    if (limit) query.take(limit);

    const fighter = await query.getMany();

    return fighter.map((fight) => ({
      ...fight,
      dateOfBirth: checkDateFormat(fight.dateOfBirth),
    }));
  }

  async create(input: CreateFighterInput): Promise<Fighter> {
    const fighter = this.fighterRepository.create(input);
    return this.fighterRepository.save(fighter);
  }
}
