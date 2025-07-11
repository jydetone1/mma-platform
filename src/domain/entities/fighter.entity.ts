import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { FightHistory } from './fight-history.entity';
import { Ranking } from './ranking.entity';

@ObjectType()
@Entity('fighters')
export class Fighter {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'first_name' })
  firstName: string;

  @Field()
  @Column({ name: 'last_name' })
  lastName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nickname?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  nationality?: string;

  @Field({ nullable: true })
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Field()
  @Column({ name: 'weight_class' })
  weightClass: string;

  @Field(() => [FightHistory], { nullable: true })
  @OneToMany(() => FightHistory, (fightHistory) => fightHistory.fighter)
  fightHistory: FightHistory[];

  @Field(() => [Ranking], { nullable: true })
  @OneToMany(() => Ranking, (ranking) => ranking.fighter)
  rankings: Ranking[];
}
