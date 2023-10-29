import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from '../services/wallets.service';
import { getMockWallet } from '../services/wallets.service.spec';
import { WalletsController } from './wallets.controller';
import { TransferToAnotherWalletDto } from '../dto/transfer-to-another-wallet';

describe('WalletsController', () => {
  let controller: WalletsController;
  let walletService: WalletsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            transferToAnotherWallet: jest.fn(),
            createTransaction: jest.fn(),
            receiveMoneyInBankAccount: jest.fn(),
            fundWallet: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    walletService = module.get<WalletsService>(WalletsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to create one', async () => {
    // GIVEN
    jest
      .spyOn(walletService, 'create')
      .mockResolvedValue(getMockWallet() as any);

    // WHEN
    const response = await controller.create({ user_id: 'mock_user_id' });

    // THEN
    expect(response.message).toBe('Wallet successfully created');
  });

  it('should be able to find one', async () => {
    // GIVEN
    const mockWallet = getMockWallet();
    jest.spyOn(walletService, 'findOne').mockResolvedValue(mockWallet as any);

    // WHEN
    const response = await controller.findOne('mock_user_id');

    // THEN
    expect(response.message).toBe('Success');
    console.log(response);
    expect(response.data.id).toBe(mockWallet.id);
    expect(response.data.balance).toBe(mockWallet.balance);
    expect(response.data.previous_balance).toBe(mockWallet.previous_balance);
  });

  it('should be able to transfer to another wallet', async () => {
    // GIVEN
    const transferDto: TransferToAnotherWalletDto = {
      source_wallet_id: 'source_wallet_id_here',
      destination_wallet_id: 'destination_wallet_id_here',
      amount: 100,
    };
    jest
      .spyOn(walletService, 'create')
      .mockResolvedValue(getMockWallet() as any);

    // WHEN
    const response = await controller.transferToAnotherWallet(transferDto);

    // THEN
    expect(response.message).toBe('Transfer successful');
  });
});
