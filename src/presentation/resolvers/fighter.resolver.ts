import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { FighterService } from '../../application/services/fighter.service';
import { Fighter } from '../../domain/entities/fighter.entity';
import { CreateFighterInput } from '../../application/dtos/create-fighter.input';

@Resolver(() => Fighter)
export class FighterResolver {
  constructor(private readonly fighterService: FighterService) {}

  @Query(() => Fighter, { nullable: true })
  async fighter(@Args('id') id: number) {
    return this.fighterService.findById(id);
  }

  @Query(() => [Fighter])
  async fighters(
    @Args('weightClass', { nullable: true }) weightClass?: string,
    @Args('limit', { nullable: true }) limit?: number,
  ) {
    return this.fighterService.findAll({ weightClass, limit });
  }

  @Mutation(() => Fighter)
  async createFighter(@Args('input') input: CreateFighterInput) {
    return this.fighterService.create(input);
  }
}
