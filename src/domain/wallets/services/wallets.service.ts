import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResponseHelper } from '../../../helpers/response.helper';
import { UsersService } from '../../users/services/users.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';
import { WalletDocument } from '../entities/wallet.entity';
import { Wallet } from './../entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<WalletDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    // create a wallet
    // validate user
    await this.usersService.findOne(createWalletDto.user_id);
    const existingWallet = await this.walletModel.findOne({
      user: new Types.ObjectId(createWalletDto.user_id),
    });
    // check if user doesn't already have a wallet
    if (existingWallet) {
      throw new HttpException(
        `Wallet already exist for user: ${createWalletDto.user_id}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const newWallet = await this.walletModel.findOneAndUpdate(
      { user: new Types.ObjectId(createWalletDto.user_id) },
      { user: new Types.ObjectId(createWalletDto.user_id) },
      {
        upsert: true,
        new: true,
        populate: { path: 'user', select: { __v: 0 } },
      },
    );
    // then create wallet
    return ResponseHelper.success(newWallet, 'Wallet successfully created.');
  }

  findAll() {
    // return all wallets
    return `This action returns all wallets`;
  }

  async findOne(walletId: string) {
    // return wallet if found
    const newWallet = await this.walletModel
      .findById(walletId)
      .populate({ path: 'user', select: { __v: 0 } });
    // then crate wallet
    return ResponseHelper.success(newWallet);
  }

  transferToAnotherWallet(updateWalletDto: UpdateWalletDto) {
    // check if source wallet exist
    // check if destination wallet exist
    // check if amount can be deducted from source wallet
    // deduct amount
    // update source wallet
    // update destination wallet
    // create transaction credit
    // create transaction debit
    // return debit transaction
    return `This action updates a # wallet`;
  }

  receiveMoneyInBankAccount(id: number) {
    return `This action removes a #${id} wallet`;
  }

  fundWallet() {
    // check if wallet exist
    // check if ref exist
    // update wallet
    // create credit transaction
    // return wallet and credit transaction
  }
}
