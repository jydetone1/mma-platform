import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Fight } from './fight.entity';
import { Transform } from 'class-transformer';

@ObjectType()
@Entity('events')
export class Event {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Date)
  @Transform(({ value }) => (value ? new Date(value) : null), {
    toClassOnly: true,
  })
  @Column({ type: 'date' })
  date: Date;

  @Field({ nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field(() => [Fight], { nullable: true })
  @OneToMany(() => Fight, (fight) => fight.event)
  fights: Fight[];
}
