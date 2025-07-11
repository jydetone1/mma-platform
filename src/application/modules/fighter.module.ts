import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FighterResolver } from '../../presentation/resolvers/fighter.resolver';
import { FighterService } from '../services/fighter.service';
import { Fighter } from '../../domain/entities/fighter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fighter])],
  providers: [FighterResolver, FighterService],
  exports: [FighterService],
})
export class FighterModule {}
