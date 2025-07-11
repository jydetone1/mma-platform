import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Fighter } from './fighter.entity';
import { Event } from './event.entity';
import { FightHistory } from './fight-history.entity';

@ObjectType()
@Entity('fights')
export class Fight {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Event, { nullable: true })
  @ManyToOne(() => Event, (event) => event.fights)
  event: Event;

  @Field(() => Fighter, { nullable: true })
  @ManyToOne(() => Fighter)
  fighter1: Fighter;

  @Field(() => Fighter, { nullable: true })
  @ManyToOne(() => Fighter)
  fighter2: Fighter;

  @Field({ nullable: true })
  @Column({ nullable: true })
  result?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  round?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  method?: string;

  @Field({ nullable: true })
  @Column({ type: 'time', nullable: true })
  time?: string;

  @Field(() => [FightHistory], { nullable: true })
  @OneToMany(() => FightHistory, (fightHistory) => fightHistory.fight)
  fightHistory: FightHistory[];

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
