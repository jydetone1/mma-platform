import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateEventInput {
  @Field()
  @IsString()
  name: string;

  @Field(() => Date)
  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : null))
  date: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  location?: string;
}
