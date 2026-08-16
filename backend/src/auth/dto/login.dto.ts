import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be exactly 10 digits' })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
