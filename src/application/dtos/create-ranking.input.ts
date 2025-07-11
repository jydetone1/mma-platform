import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsString, IsInt, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateRankingInput {
  @Field(() => Int)
  @IsInt()
  fighterId: number;

  @Field()
  @IsString()
  weightClass: string;

  @Field(() => Int)
  @IsInt()
  points: number;

  @Field(() => Int)
  @IsInt()
  rankPosition: number;

  @Field(() => Float)
  @IsNumber()
  winPercentage: number;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  lastFightDate?: Date;
}
