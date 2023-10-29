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
  @IsAlphanumeric()
  @IsNotEmpty()
  source_wallet_id: string;

  @IsAlphanumeric()
  @IsNotEmpty()
  destination_wallet_id: string;

  @IsNumber()
  @IsPositive()
  @IsInt()
  amount: number;

  @IsString()
  @IsOptional()
  ref?: string;

  // pin: string;
}

export class TransferToAnotherWalletResponseDto {
  //
}
