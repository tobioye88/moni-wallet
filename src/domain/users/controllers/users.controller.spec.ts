import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Types } from 'mongoose';
import { ResponseHelper } from '../../../helpers/response.helper';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUser } from '../interfaces/user.interface';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: () =>
              ResponseHelper.success(
                getMockUser(),
                'User with email already exist',
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const validUser: IUser = {
      first_name: 'john',
      last_name: 'dfdf',
      email: 'john@mail.com',
      phone_number: '08012341234',
      dob: new Date('1999-01-01'),
    };
    // WHEN
    const response = await controller.create(validUser);

    // THEN
    expect(response.message).toBe('User with email already exist');
  });

  it('should validate all inputs', async () => {
    const inputs = [
      {
        input: {
          first_name: 'john',
          last_name: 'dfdf',
          email: 'john@mail.com',
          phone_number: '08012341234',
          dob: '1999-01-01',
        },
        expect: {},
      },
      {
        input: {
          first_name: '',
          last_name: 'dfdf1',
          email: 'johnmail.com',
          phone_number: '0801241234',
          dob: '1999-01',
        },
        expect: {
          first_name: {
            minLength:
              'first_name must be longer than or equal to 3 characters',
            isNotEmpty: 'first_name should not be empty',
            isAlpha: 'first_name must contain only letters (a-zA-Z)',
          },
          last_name: {
            isAlpha: 'last_name must contain only letters (a-zA-Z)',
          },
          email: { isEmail: 'email must be an email' },
          phone_number: {
            minLength:
              'phone_number must be longer than or equal to 11 characters',
          },
        },
      },
    ];
    for (const test of inputs) {
      const myDto = plainToInstance(CreateUserDto, test.input);
      const errors = await validate(myDto);

      errors.forEach((err) => {
        expect(err.constraints).toStrictEqual(test.expect[err.property]);
      });
    }
  });
});

function getMockUser(params?: Partial<IUser>): IUser {
  return {
    _id: params?._id || new Types.ObjectId(),
    id: params?.id || 'string',
    first_name: params?.first_name || 'string',
    last_name: params?.last_name || 'string',
    email: params?.email || 'string',
    phone_number: params?.phone_number || 'string',
    dob: params?.dob || new Date('1999-01-01'),
    created_at: params?.created_at || new Date(),
    updated_at: params?.updated_at || new Date(),
  };
}
