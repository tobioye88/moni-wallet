import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletsController } from './controllers/wallets.controller';
import { Wallet, WalletSchema } from './entities/wallet.entity';
import { WalletsService } from './services/wallets.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Wallet.name, useFactory: () => WalletSchema },
    ]),
    UsersModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
})
export class WalletsModule {}
