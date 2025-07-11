import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateFighterInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nickname?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  nationality?: string;

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : null))
  dateOfBirth?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  weightClass: string;
}
