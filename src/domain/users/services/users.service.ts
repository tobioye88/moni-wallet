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
      const createdUser = await this.usersModel.create(createUserDto);
      // TODO: ADD USER CREATION NOTIFICATION
      return ResponseHelper.success(createdUser, 'c');
    } catch (error) {
      console.log('CreateUserError', error);
      return ResponseHelper.error('Unknown error', null);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
