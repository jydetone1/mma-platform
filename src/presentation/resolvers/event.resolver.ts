import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { EventService } from '../../application/services/event.service';
import { Event } from '../../domain/entities/event.entity';
import { CreateEventInput } from 'src/application/dtos/create.event.input';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => Event, { nullable: true, name: 'event' })
  async event(@Args('id', { type: () => Int }) id: number) {
    return this.eventService.findById(id);
  }

  @Query(() => [Event], { name: 'events' })
  async events(
    @Args('upcoming', { type: () => Boolean, nullable: true })
    upcoming?: boolean,
  ) {
    return this.eventService.findAll({ upcoming });
  }

  @Mutation(() => Event, { name: 'createEvent' })
  async createEvent(@Args('input') input: CreateEventInput) {
    return this.eventService.create(input);
  }
}
