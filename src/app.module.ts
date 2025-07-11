import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { ConfigService } from './config/config.service';
import { typeOrmConfig } from './infrastructure/database/typeorm.config';
import { ConfigModule } from 'src/config/config.module';
import { RankingModule } from 'src/application/modules/ranking.module';
import { FighterModule } from './application/modules/fighter.module';
import { EventModule } from './application/modules/event.module';
import { FightHistoryModule } from './application/modules/fight-history.modules';
import { FightModule } from './application/modules/fight.module';

const configService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        'src/presentation/schemas/schema.gql',
      ),
      sortSchema: true,
      playground: true,
    }),
    BullModule.forRoot({
      redis: {
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('REDIS_PORT'), 10),
      },
    }),
    ConfigModule,
    FighterModule,
    EventModule,
    RankingModule,
    FightHistoryModule,
    FightModule,
  ],
})
export class AppModule {}
