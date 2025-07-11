import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventResolver } from '../../presentation/resolvers/event.resolver';
import { EventService } from '../services/event.service';
import { Event } from '../../domain/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventResolver, EventService],
  exports: [EventService],
})
export class EventModule {}
