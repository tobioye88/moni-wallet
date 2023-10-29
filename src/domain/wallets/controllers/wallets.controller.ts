import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseHelper } from '../../../helpers/response.helper';
import {
  CreateWalletDto,
  CreateWalletResponseDto,
} from '../dto/create-wallet.dto';
import {
  TransferToAnotherWalletDto,
  TransferToAnotherWalletResponseDto,
} from '../dto/transfer-to-another-wallet';
import { WalletsService } from '../services/wallets.service';

@ApiTags('Wallets')
@Controller('v1/wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new Wallet',
  })
  @ApiResponse({
    status: 201,
    type: CreateWalletResponseDto,
  })
  async create(@Body() createWalletDto: CreateWalletDto) {
    const wallet = await this.walletsService.create(createWalletDto);
    return ResponseHelper.success(wallet, 'Wallet successfully created');
  }

  @Post('transfer')
  @ApiOperation({
    summary: 'Transfer from one wallet to another',
    description: 'Amount can only be in kobo',
  })
  @ApiResponse({
    status: 201,
    type: TransferToAnotherWalletResponseDto,
  })
  async transferToAnotherWallet(
    @Body() transferDto: TransferToAnotherWalletDto,
  ) {
    const response =
      await this.walletsService.transferToAnotherWallet(transferDto);
    return ResponseHelper.success(response, 'Transfer successful');
  }

  @Get(':walletId')
  async findOne(@Param('walletId') walletId: string) {
    const wallet = await this.walletsService.findOne(walletId);
    return ResponseHelper.success(wallet);
  }
}
