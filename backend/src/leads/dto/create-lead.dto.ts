import { IsString, IsNotEmpty, Matches, IsOptional, Min, Max, IsNumberString } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be exactly 10 digits' })
  phone: string;

  @IsOptional()
  @IsNumberString({}, { message: 'Age must be a number' })
  age?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  healthConditions?: string;

  @IsString()
  @IsOptional()
  time?: string;
}
