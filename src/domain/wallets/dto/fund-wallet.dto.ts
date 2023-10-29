import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FundWalletDto {
  @ApiProperty()
  @IsString()
  wallet_id: string;

  @ApiProperty()
  @IsString()
  ref: string;
}

export class User {
  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  dob: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  id: string;
}

export class Data {
  @ApiProperty()
  user: User;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  previous_balance: number;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  id: string;
}

export class FundWalletResponseDto {
  @ApiProperty()
  data: Data;

  @ApiProperty()
  message: string;
}
