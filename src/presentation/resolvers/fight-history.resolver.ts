import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { FightHistoryService } from 'src/application/services/fight-history.service';
import { FightHistory } from 'src/domain/entities/fight-history.entity';

@Resolver(() => FightHistory)
export class FightHistoryResolver {
  constructor(private readonly fightHistoryService: FightHistoryService) {}

  @Query(() => FightHistory, { nullable: true, name: 'fightHistory' })
  async fightHistory(@Args('id', { type: () => Int }) id: number) {
    return this.fightHistoryService.findById(id);
  }

  @Query(() => [FightHistory], { name: 'fightHistories' })
  async fightHistories(
    @Args('fighterId', { type: () => Int, nullable: true }) fighterId?: number,
    @Args('fightId', { type: () => Int, nullable: true }) fightId?: number,
  ) {
    return this.fightHistoryService.findAll({ fighterId, fightId });
  }
}
