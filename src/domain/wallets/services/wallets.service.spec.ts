import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getMockUser } from '../../users/controllers/users.controller.spec';
import { IUser } from '../../users/interfaces/user.interface';
import { UsersService } from '../../users/services/users.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { TransferToAnotherWalletDto } from '../dto/transfer-to-another-wallet';
import { Wallet, WalletDocument } from '../entities/wallet.entity';
import { IWallet } from '../interfaces/wallet.interface';
import { TransactionType, WalletsService } from './wallets.service';

describe('WalletsService', () => {
  let walletsService: WalletsService;
  let usersService: UsersService;
  let walletModel: Model<WalletDocument>;
  const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletsService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findById: jest.fn(),
            startSession: jest.fn(),
          },
        },
        {
          provide: getModelToken(Wallet.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findById: jest.fn(),
            populate: jest.fn(),
            startSession: jest.fn(),
          },
        },
      ],
    }).compile();

    walletsService = module.get<WalletsService>(WalletsService);
    usersService = module.get<UsersService>(UsersService);
    walletModel = module.get(getModelToken(Wallet.name));
  });

  describe('create', () => {
    it('should create a wallet', async () => {
      const mockWallet = getMockWallet();
      const createWalletDto: CreateWalletDto = {
        user_id: 'user_id_here',
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValue(getMockUser());
      jest.spyOn(walletModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(walletModel, 'findOneAndUpdate').mockResolvedValue(mockWallet);

      const wallet = await walletsService.create(createWalletDto);

      expect(wallet).toBeDefined();
      expect(wallet.balance).toBe(mockWallet.balance);
      expect(wallet.id).toBe(mockWallet.id);
    });

    it('should throw an error if wallet already exists', async () => {
      const createWalletDto: CreateWalletDto = {
        user_id: 'user_id_here',
      };
      jest.spyOn(walletModel, 'findOne').mockResolvedValue(getMockWallet());

      await expect(
        walletsService.create(createWalletDto),
      ).rejects.toThrowError();
    });
  });

  describe('transferToAnotherWallet', () => {
    it('should transfer money to another wallet', async () => {
      const transferDto: TransferToAnotherWalletDto = {
        source_wallet_id: 'source_wallet_id_here',
        destination_wallet_id: 'destination_wallet_id_here',
        amount: 100,
      };

      const sourceWallet = {
        _id: 'source_wallet_id_here',
        balance: 500, // Assuming the source wallet has enough balance
        previous_balance: 500,
      };

      const destinationWallet = {
        _id: 'destination_wallet_id_here',
        balance: 200,
        previous_balance: 200,
      };

      jest.spyOn(walletModel, 'findById').mockResolvedValueOnce(sourceWallet);
      jest
        .spyOn(walletModel, 'findById')
        .mockResolvedValueOnce(destinationWallet);
      jest.spyOn(walletModel, 'startSession').mockReturnValue(mockSession);
      jest.spyOn(walletModel, 'findOneAndUpdate').mockReturnValueOnce({
        ...sourceWallet,
        amount: sourceWallet.balance - transferDto.amount,
      } as any);
      jest.spyOn(walletModel, 'findOneAndUpdate').mockReturnValueOnce({
        ...destinationWallet,
        amount: destinationWallet.balance + transferDto.amount,
      } as any);

      const result = await walletsService.transferToAnotherWallet(transferDto);

      expect(result).toBeDefined();
      expect(result.type).toBe(TransactionType.DEBIT);
    });

    it('should throw an error if the source wallet does not exist', async () => {
      const transferDto: TransferToAnotherWalletDto = {
        source_wallet_id: 'non_existent_wallet_id',
        destination_wallet_id: 'destination_wallet_id_here',
        amount: 100,
      };

      jest.spyOn(walletModel, 'startSession').mockReturnValue(mockSession);
      jest.spyOn(walletModel, 'findById').mockResolvedValue(null);

      await expect(
        walletsService.transferToAnotherWallet(transferDto),
      ).rejects.toThrowError(HttpException);
    });

    it('should throw an error if the destination wallet does not exist', async () => {
      const transferDto: TransferToAnotherWalletDto = {
        source_wallet_id: 'source_wallet_id_here',
        destination_wallet_id: 'non_existent_wallet_id',
        amount: 100,
      };

      const sourceWallet = {
        _id: 'source_wallet_id_here',
        balance: 500,
        previous_balance: 500,
      };

      jest.spyOn(walletModel, 'startSession').mockReturnValue(mockSession);
      jest.spyOn(walletModel, 'findById').mockResolvedValue(sourceWallet);
      jest.spyOn(walletModel, 'findById').mockResolvedValue(null);

      await expect(
        walletsService.transferToAnotherWallet(transferDto),
      ).rejects.toThrowError(HttpException);
    });

    it('should throw an error if the source wallet has insufficient funds', async () => {
      const transferDto: TransferToAnotherWalletDto = {
        source_wallet_id: 'source_wallet_id_here',
        destination_wallet_id: 'destination_wallet_id_here',
        amount: 1000, // Assuming the source wallet has insufficient funds
      };

      const sourceWallet = {
        _id: 'source_wallet_id_here',
        balance: 500,
        previous_balance: 500,
      };

      // const destinationWallet = {
      //   _id: 'destination_wallet_id_here',
      //   balance: 200,
      //   previous_balance: 200,
      // };

      jest.spyOn(walletModel, 'startSession').mockReturnValue(mockSession);
      jest.spyOn(walletModel, 'findById').mockResolvedValue(sourceWallet);

      await expect(
        walletsService.transferToAnotherWallet(transferDto),
      ).rejects.toThrowError(HttpException);
    });
  });

  describe('findOne', () => {
    it('should find one successfully', async () => {
      const mockWallet = {
        _id: 'source_wallet_id_here',
        id: 'source_wallet_id_here',
        balance: 500,
        previous_balance: 500,
      };

      // jest.spyOn(walletModel, 'findOne').mockResolvedValue(mockWallet as any);
      jest.spyOn(walletModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => mockWallet as any,
          }) as any,
      );
      const result = await walletsService.findOne('wallet_id');
      expect(result.id).toBe(mockWallet.id);
      expect(result.balance).toBe(mockWallet.balance);
      expect(result.previous_balance).toBe(mockWallet.previous_balance);
    });

    it('should throw an error when the wallet is not found', async () => {
      const walletId = 'non_existent_wallet_id';

      jest.spyOn(walletModel, 'findById').mockImplementation(
        () =>
          ({
            populate: () => null,
          }) as any,
      );

      await expect(walletsService.findOne(walletId)).rejects.toThrowError(
        HttpException,
      );
      await expect(walletsService.findOne(walletId)).rejects.toThrowError(
        new HttpException('Wallet not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

export const getMockWallet = (params?: Partial<IWallet>) => {
  return {
    id: params?.id || 'wallet_id',
    balance: params?.balance || 1000,
    previous_balance: params?.previous_balance || 1000,
    user: params?.user || getMockUser(params?.user as IUser),
    created_at: params?.created_at || new Date(),
    updated_at: params?.updated_at || new Date(),
  };
};
