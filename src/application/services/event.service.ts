import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../domain/entities/event.entity';
import { CreateEventInput } from 'src/application/dtos/create.event.input';
import { checkDateFormat } from 'src/common/constant';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async findById(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['fights'],
    });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    return {
      ...event,
      date: checkDateFormat(event.date),
    };
  }

  async findAll({ upcoming }: { upcoming?: boolean }): Promise<Event[]> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.fights', 'fights');

    if (upcoming === true) {
      query.andWhere('event.date >= CURRENT_DATE');
    } else if (upcoming === false) {
      query.andWhere('event.date < CURRENT_DATE');
    }

    const events = await query.getMany();

    return events.map((event) => ({
      ...event,
      date: checkDateFormat(event.date),
    }));
  }

  async create(input: CreateEventInput): Promise<Event> {
    const event = this.eventRepository.create(input);
    return this.eventRepository.save(event);
  }
}
