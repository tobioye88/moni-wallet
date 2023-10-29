import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaystackUtil } from '../../utils/paystack.util';
import { UsersModule } from '../users/users.module';
import { WalletsController } from './controllers/wallets.controller';
import {
  FundsReference,
  FundsReferenceSchema,
} from './entities/funds-ref.entity';
import { Wallet, WalletSchema } from './entities/wallet.entity';
import { WalletsService } from './services/wallets.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Wallet.name, useFactory: () => WalletSchema },
      { name: FundsReference.name, useFactory: () => FundsReferenceSchema },
    ]),
    UsersModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService, PaystackUtil],
})
export class WalletsModule {}
