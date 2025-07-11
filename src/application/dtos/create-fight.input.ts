import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

@InputType()
export class CreateFightInput {
  @Field(() => Int)
  @IsInt()
  eventId: number;

  @Field(() => Int)
  @IsInt()
  fighter1Id: number;

  @Field(() => Int)
  @IsInt()
  fighter2Id: number;
}
