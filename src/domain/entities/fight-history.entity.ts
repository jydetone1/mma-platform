import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Fighter } from './fighter.entity';
import { Fight } from './fight.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('fight_history')
export class FightHistory {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Fighter, { nullable: true })
  @ManyToOne(() => Fighter, (fighter) => fighter.fightHistory)
  fighter: Fighter;

  @Field(() => Fight, { nullable: true })
  @ManyToOne(() => Fight, (fight) => fight.fightHistory)
  fight: Fight;

  @Field()
  @Column()
  outcome: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  method?: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
