import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class TransferToAnotherWalletDto {
  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  source_wallet_id: string;

  @ApiProperty()
  @IsAlphanumeric()
  @IsNotEmpty()
  destination_wallet_id: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  amount: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  ref?: string;

  // pin: string;
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

export class Wallet {
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
export class Data {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  wallet: Wallet;

  @ApiProperty()
  source_wallet_id: string;

  @ApiProperty()
  source_wallet_previous_balance: number;

  @ApiProperty()
  destination_wallet_id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  external_ref: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

export class TransferToAnotherWalletResponseDto {
  @ApiProperty()
  data: Data;

  @ApiProperty()
  message: string;
}
