import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightResolver } from 'src/presentation/resolvers/fight.resolver';
import { FightService } from '../services/fight.service';
import { Fight } from 'src/domain/entities/fight.entity';
import { RankingModule } from './ranking.module';
import { Event } from 'src/domain/entities/event.entity';
import { Fighter } from 'src/domain/entities/fighter.entity';
import { FightHistoryModule } from './fight-history.modules';

@Module({
  imports: [
    TypeOrmModule.forFeature([Fight, Event, Fighter]),
    RankingModule,
    FightHistoryModule,
  ],
  providers: [FightResolver, FightService],
  exports: [FightService],
})
export class FightModule {}
