import { PartialType } from '@nestjs/swagger';
import { CreateWalletDto } from './create-wallet.dto';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  sourceWalletId: string;
  destinationWalletId: string;
  amount: string;
  pin: string;
}
