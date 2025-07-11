import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Ranking } from 'src/domain/entities/ranking.entity';
import { FightHistory } from 'src/domain/entities/fight-history.entity';
import { RankingProcessor } from 'src/infrastructure/queques/ranking.processor';
import { RankingService } from '../services/ranking.service';
import { RankingResolver } from 'src/presentation/resolvers/ranking.resolver';
import { Fighter } from 'src/domain/entities/fighter.entity';
import { FightHistoryService } from 'src/application/services/fight-history.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ranking, FightHistory, Fighter]),
    BullModule.registerQueue({
      name: 'ranking',
    }),
  ],
  providers: [
    RankingService,
    RankingResolver,
    RankingProcessor,
    FightHistoryService,
  ],
  exports: [RankingService, FightHistoryService],
})
export class RankingModule {}
