import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '../../users/services/users.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { TransferToAnotherWalletDto } from '../dto/transfer-to-another-wallet';
import { WalletDocument } from '../entities/wallet.entity';
import { IWallet } from '../interfaces/wallet.interface';
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
    return newWallet;
  }

  findAll() {
    // return all wallets
    return `This action returns all wallets`;
  }

  async findOne(walletId: string) {
    // return wallet if found
    const wallet = await this.walletModel
      .findById(walletId)
      .populate({ path: 'user', select: { __v: 0 } });

    if (!wallet) {
      throw new HttpException('Wallet not found', 404);
    }

    return wallet;
  }

  async transferToAnotherWallet(transferDto: TransferToAnotherWalletDto) {
    const externalRef = transferDto.ref || '';
    const session = await this.walletModel.startSession();
    session.startTransaction();
    // check if source wallet exist
    let debitTransaction;
    try {
      const sourceWallet = await this.walletModel.findById<IWallet>(
        transferDto.source_wallet_id,
        null,
        { session: session },
      );
      if (!sourceWallet) {
        throw new HttpException(
          'Source wallet not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      // check if destination wallet exist
      const destinationWallet = await this.walletModel.findById<IWallet>(
        transferDto.destination_wallet_id,
        null,
        { $session: session },
      );
      if (!destinationWallet) {
        throw new HttpException(
          'Destination wallet not found',
          HttpStatus.BAD_REQUEST,
        );
      }
      // check if amount can be deducted from source wallet
      if (sourceWallet.balance < transferDto.amount) {
        throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
      }
      // deduct amount
      const newSourceWalletBalance =
        Number(sourceWallet.balance) - Number(transferDto.amount);
      const newDestinationWalletBallance =
        Number(destinationWallet.balance) + Number(transferDto.amount);
      // update source wallet
      const updatedSourceWallet =
        await this.walletModel.findOneAndUpdate<IWallet>(
          { _id: sourceWallet._id },
          {
            $set: {
              balance: newSourceWalletBalance,
              previous_balance: sourceWallet.balance,
            },
          },
          { $session: session, new: true, populate: 'user' },
        );
      // update destination wallet
      const updatedDestinationWallet = await this.walletModel.findOneAndUpdate(
        { _id: destinationWallet._id },
        {
          $set: {
            balance: newDestinationWalletBallance,
            previous_balance: destinationWallet.balance,
          },
        },
        { $session: session, new: true },
      );
      // create transaction credit
      debitTransaction = this.createTransaction(
        updatedDestinationWallet,
        updatedSourceWallet,
        transferDto.amount,
        sourceWallet.previous_balance,
        destinationWallet.previous_balance,
        externalRef,
        TransactionType.DEBIT,
      );
      // create transaction debit
      this.createTransaction(
        updatedDestinationWallet,
        updatedSourceWallet,
        transferDto.amount,
        sourceWallet.previous_balance,
        destinationWallet.previous_balance,
        externalRef,
        TransactionType.CREDIT,
      );
      // return debit transaction
    } catch (e) {
      console.log('wallet to wallet transfer', e);
      session.abortTransaction();
      if (e.status) {
        throw new HttpException(e.message, e.status);
      }
      throw new HttpException('Unknown error', 500);
    }

    return debitTransaction;
  }

  createTransaction(
    destinationWallet: IWallet,
    sourceWallet: IWallet,
    amount: number,
    previousBalanceSource: number,
    previousBalanceDestination: number,
    externalRef: string,
    transactionType: TransactionType,
  ): any {
    // Out of scope -> save to transaction table
    // source
    //   WalletId
    //   previousBalance
    // destination
    //   WalletId
    //   previousBalance
    // amount
    // type: DEBIT, CREDIT,
    // externalRef
    // createdAt
    // updatedAt
    let transaction = {};
    if (transactionType === TransactionType.DEBIT) {
      transaction = {
        id: new Types.ObjectId(),
        amount,
        wallet: sourceWallet,
        source_wallet_id: sourceWallet.id,
        source_wallet_previous_balance: previousBalanceSource,
        destination_wallet_id: destinationWallet.id,
        // destination_wallet_previous_balance: previousBalanceDestination, // internal use only
        type: transactionType,
        external_ref: externalRef,
        created_at: new Date(),
        updated_at: new Date(),
      };
    } else {
      transaction = {
        id: new Types.ObjectId(),
        amount,
        wallet: destinationWallet,
        source_wallet_id: sourceWallet.id,
        source_wallet_previous_balance: previousBalanceSource,
        destination_wallet_id: destinationWallet.id,
        // destination_wallet_previous_balance: previousBalanceDestination, // internal use only
        type: transactionType,
        external_ref: externalRef,
        created_at: new Date(),
        updated_at: new Date(),
      };
    }

    return transaction;
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

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}
