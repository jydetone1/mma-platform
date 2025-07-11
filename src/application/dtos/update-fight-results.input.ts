import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt } from 'class-validator';

@InputType()
export class UpdateFightResultInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  result?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  method?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  round?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  time?: string;
}
