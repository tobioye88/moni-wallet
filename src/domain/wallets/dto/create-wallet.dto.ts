import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../../users/interfaces/user.interface';

export class CreateWalletDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}

export class ResponseWallet {
  @ApiProperty()
  balance: number;

  @ApiProperty()
  user: IUser;
}

export class CreateWalletResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  data: ResponseWallet;
}
