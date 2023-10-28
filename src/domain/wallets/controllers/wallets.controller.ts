import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateWalletDto,
  CreateWalletResponseDto,
} from '../dto/create-wallet.dto';
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
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletsService.create(createWalletDto);
  }

  @Get(':walletId')
  findOne(@Param('walletId') walletId: string) {
    return this.walletsService.findOne(walletId);
  }
}
