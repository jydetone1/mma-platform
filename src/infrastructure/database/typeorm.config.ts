import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigService } from '../../config/config.service';
import { Event } from '../../domain/entities/event.entity';
import { FightHistory } from '../../domain/entities/fight-history.entity';
import { Fight } from '../../domain/entities/fight.entity';
import { Fighter } from '../../domain/entities/fighter.entity';
import { Ranking } from '../../domain/entities/ranking.entity';

const configService = new ConfigService();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get('DATABASE_HOST'),
  port: parseInt(configService.get('DATABASE_PORT'), 10) || 5432,
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  entities: [Event, FightHistory, Fight, Fighter, Ranking],
  migrations: ['dist/migrations/*.js'],
  synchronize: false, // Disable in production
  migrationsRun: true,
};

export const AppDataSource = new DataSource(typeOrmConfig as any);
