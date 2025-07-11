import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RankingService } from '../../application/services/ranking.service';
import { Ranking } from 'src/domain/entities/ranking.entity';
import { CreateRankingInput } from 'src/application/dtos/create-ranking.input';

@Resolver(() => Ranking)
export class RankingResolver {
  constructor(private readonly rankingService: RankingService) {}

  @Query(() => [Ranking], { name: 'rankings' })
  async rankings(
    @Args('weightClass', { type: () => String, nullable: true })
    weightClass?: string,
  ) {
    return this.rankingService.findAll({ weightClass });
  }

  @Mutation(() => Ranking, { name: 'createRanking' })
  async createRanking(@Args('input') input: CreateRankingInput) {
    return this.rankingService.create(input);
  }
}
