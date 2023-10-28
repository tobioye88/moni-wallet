import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User, UserDocument } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';
import {
  IResponseHelper,
  ResponseHelper,
} from './../../../helpers/response.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly usersModel: Model<UserDocument>,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<IResponseHelper<IUser>> {
    console.log('createUserDto', createUserDto);
    const existingUser = await this.usersModel.findOne<IUser>({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new HttpException('User with email already exist', 400);
    }

    try {
      const createdUser = await this.usersModel.create<IUser>(createUserDto);
      await this.notifyUserAccountCreation(createdUser);
      return ResponseHelper.success(createdUser, 'User created successfully');
    } catch (error) {
      console.log('CreateUserError', error);
      throw new HttpException('Unknown error', 500);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async notifyUserAccountCreation(createdUser: IUser) {
    // send emails here
    // send sms here
  }

  async findOne(userId: string): Promise<IUser> {
    const user = await this.usersModel.findById<IUser>(userId);
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
