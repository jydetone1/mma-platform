import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FightHistoryResolver } from 'src/presentation/resolvers/fight-history.resolver';
import { FightHistory } from 'src/domain/entities/fight-history.entity';
import { FightHistoryService } from '../services/fight-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([FightHistory])],
  providers: [FightHistoryResolver, FightHistoryService],
  exports: [FightHistoryService],
})
export class FightHistoryModule {}
