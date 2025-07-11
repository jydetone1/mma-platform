import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { FightService } from 'src/application/services/fight.service';
import { Fight } from 'src/domain/entities/fight.entity';
import { UpdateFightResultInput } from 'src/application/dtos/update-fight-results.input';
import { CreateFightInput } from 'src/application/dtos/create-fight.input';

@Resolver(() => Fight)
export class FightResolver {
  constructor(private readonly fightService: FightService) {}

  @Query(() => Fight, { nullable: true, name: 'fight' })
  async fight(@Args('id', { type: () => Int }) id: number) {
    return this.fightService.findById(id);
  }

  @Query(() => [Fight], { name: 'fights' })
  async fights(
    @Args('eventId', { type: () => Int, nullable: true }) eventId?: number,
    @Args('fighterId', { type: () => Int, nullable: true }) fighterId?: number,
  ) {
    return this.fightService.findAll({ eventId, fighterId });
  }

  @Mutation(() => Fight, { name: 'createFight' })
  async createFight(@Args('input') input: CreateFightInput) {
    return this.fightService.create(input);
  }

  @Mutation(() => Fight, { name: 'updateFightResult' })
  async updateFightResult(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateFightResultInput,
  ) {
    return this.fightService.updateFightResult(id, input);
  }
}
