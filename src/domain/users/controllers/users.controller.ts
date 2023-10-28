import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IResponseHelper } from '../../../helpers/response.helper';
import { CreateUserDto, CreateUserResponseDto } from '../dto/create-user.dto';
import { IUser } from '../interfaces/user.interface';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    status: 201,
    type: CreateUserResponseDto,
  })
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponseHelper<IUser>> {
    return this.usersService.create(createUserDto);
  }
}
