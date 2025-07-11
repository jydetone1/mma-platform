import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Fighter } from './fighter.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType() // Mark as GraphQL type
@Entity('rankings')
export class Ranking {
  @Field(() => ID) // Define GraphQL ID type
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Fighter], { nullable: true })
  @ManyToOne(() => Fighter, (fighter) => fighter.rankings)
  fighter: Fighter;

  @Field()
  @Column({ name: 'weight_class' })
  weightClass: string;

  @Field()
  @Column({ default: 0 })
  points: number;

  @Field()
  @Column({ name: 'rank_position' })
  rankPosition: number;

  @Field()
  @Column({ name: 'win_percentage', type: 'float', default: 0 })
  winPercentage: number;

  @Field()
  @Column({ name: 'last_fight_date', type: 'date', nullable: true })
  lastFightDate?: Date;
}
